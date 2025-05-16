import { Injectable, OnModuleInit } from '@nestjs/common';
import {
    ComputeBudgetProgram,
    Connection,
    Keypair,
    ParsedAccountData,
    PublicKey,

    TransactionMessage,
    VersionedTransaction,
} from '@solana/web3.js';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet } from 'src/entities/wallet.schema';
import { Model, Types } from 'mongoose';
import { decryptData, encryptData } from 'src/common/helpers/cryptography';
import { ConfigService } from '@nestjs/config';
import { createMintToInstruction, createTransferInstruction, getOrCreateAssociatedTokenAccount, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import * as bs58 from 'bs58';

// For devnet, set your endpoint here.
// Example: https://api.devnet.solana.com
const SOLANA_DEVNET_ENDPOINT = 'https://api.devnet.solana.com';

// USDC mint address on Solana devnet. Confirm the correct devnet mint from official sources:
const USDC_DEVNET_MINT = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
const ERD_DEVNET_MINT = new PublicKey('6VkhHTyufTyWyidbvnKfA8CkHZVsrrbQe3GdKZib1u1X')

@Injectable()
export class WalletService implements OnModuleInit {
    private connection: Connection;

    constructor(
        @InjectModel(Wallet.name) private walletModel: Model<Wallet>,
        private readonly configService: ConfigService,
    ) { }

    onModuleInit() {
        this.connection = new Connection(SOLANA_DEVNET_ENDPOINT, 'confirmed');
    }

    async getUserWallet(userId: string): Promise<Wallet | null> {
        return this.walletModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
    }

    async updateLockedBalance(
        userId: string,
        lockedBalance: number,
    ): Promise<Wallet | null> {
        const wallet = await this.walletModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
        if (!wallet) {
            throw new Error(`Wallet not found for user`);
        }
        return this.walletModel
            .findOneAndUpdate(
                { userId: new Types.ObjectId(userId) },
                { lockedBalance },
                { new: true },
            )
            .exec();
    }

    /**
     * Creates a new Solana wallet (Keypair) for a user.
     * In production, store the private key securely (e.g., in an encrypted vault, KMS, or a secure DB).
     */
    async createUserWallet(userId: string): Promise<{
        publicKey: string;
    }> {
        // Check if a wallet already exists for the user
        const existingWallet = await this.walletModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
        if (existingWallet) {
            return {
                publicKey: existingWallet.publicKey,
            };
        }

        // Generate a new wallet (Keypair)
        const keypair = Keypair.generate();

        console.log("🚀 ~ WalletService ~ createUserWallet ~ keypair.secretKey:", keypair.secretKey)
        console.log("🚀 ~ WalletService ~ createUserWallet ~ keypair.publicKey:", bs58.encode(Buffer.from(keypair.secretKey)));

        // Create a new wallet entity and save it to the database
        const newWallet = new this.walletModel({
            userId: new Types.ObjectId(userId),
            publicKey: keypair.publicKey.toBase58(),
            encryptedPrivateKey: encryptData(Buffer.from(keypair.secretKey).toString('base64'), this.configService.get('secret') || ''), // Store securely in production
        });
        await newWallet.save();

        return {
            publicKey: keypair.publicKey.toBase58(),
        };
    }

    /**
     * Retrieves the user's USDC balance on devnet.
     * userSecretKey must be the base64-encoded secret key from createUserWallet() or your DB.
     */
    async getUserUsdcBalance(userId: string): Promise<number> {
        const userPubKey = new PublicKey((await this.walletModel.findOne({ userId: new Types.ObjectId(userId) }).exec())?.publicKey);

        // Find associated token account for the user
        const tokenAccountInfo = await this.connection.getTokenAccountsByOwner(
            userPubKey,
            { mint: USDC_DEVNET_MINT },
        );

        if (tokenAccountInfo.value.length === 0) {
            // User doesn't have a token account yet, so balance is zero
            return 0;
        }

        const accountData = tokenAccountInfo.value[0].account.data;
        // The raw data includes the account info. We can decode it using @solana/spl-token or parse the result
        // For simplicity, use the parseTokenAccountData helper from spl-token's newer versions
        const balanceInfo = await this.connection.getTokenAccountBalance(
            tokenAccountInfo.value[0].pubkey,
        );
        // `balanceInfo.value.uiAmount` is typically the easiest to read
        return balanceInfo.value.uiAmount ?? 0;
    }

    async getUserErdBalance(userId: string): Promise<number> {
        const userPubKey = new PublicKey((await this.walletModel.findOne({ userId: new Types.ObjectId(userId) }).exec())?.publicKey);

        // Find associated token account for the user
        const tokenAccountInfo = await this.connection.getTokenAccountsByOwner(
            userPubKey,
            { mint: ERD_DEVNET_MINT },
        );

        if (tokenAccountInfo.value.length === 0) {
            // User doesn't have a token account yet, so balance is zero
            return 0;
        }

        const accountData = tokenAccountInfo.value[0].account.data;
        // The raw data includes the account info. We can decode it using @solana/spl-token or parse the result
        // For simplicity, use the parseTokenAccountData helper from spl-token's newer versions
        const balanceInfo = await this.connection.getTokenAccountBalance(
            tokenAccountInfo.value[0].pubkey,
        );
        // `balanceInfo.value.uiAmount` is typically the easiest to read
        return balanceInfo.value.uiAmount ?? 0;
    }

    async collectFare(passengers: string[], fare: number, walletAddress: string): Promise<any> {
        console.log("🚀 ~ WalletService ~ collectFare ~ walletAddress:", walletAddress);
        console.log("🚀 ~ WalletService ~ collectFare ~ fare:", fare);
        console.log("🚀 ~ WalletService ~ collectFare ~ passengers:", passengers);

        const wallets: Wallet[] = await Promise.all(passengers.map(async (passenger) => {
            return await this.walletModel.findOne({ userId: new Types.ObjectId(passenger) }).exec();
        }));


        const res = []


        try {
            for (const wallet of wallets) {
                if (!wallet || !wallet.encryptedPrivateKey) {
                    console.error(`Wallet or encrypted private key not found for passenger: ${wallet?.userId}`);
                    continue;
                }

                const response = await this.transfer(
                    decryptData(wallet.encryptedPrivateKey, this.configService.get('secret') || ''),
                    walletAddress,
                    fare,
                );

                res.push(response);
            }
        }
        catch (err) {
            console.error("🚀 ~ WalletService ~ collectFare ~ err:", err);
            throw new Error("Error while transferring fare");
        }

        return res;
    }

    async collectCredits(userId: string, tokenAmount: number): Promise<any> {
        const wallet = await this.walletModel.findOne({ userId: new Types.ObjectId(userId) }).exec();
        if (!wallet) {
            throw new Error(`Wallet not found for user: ${userId}`);
        }

        return await this.mint(wallet.publicKey, tokenAmount)
    }

    // Fetches the number of decimals for a given token to accurately handle token amounts.
    async getNumberDecimals(
        mintAddress: PublicKey
    ): Promise<number> {
        const info = await this.connection.getParsedAccountInfo(mintAddress);
        const decimals = (info.value?.data as ParsedAccountData).parsed.info
            .decimals as number;
        console.log(`Token Decimals: ${decimals}`);
        return decimals;
    }

    // Initializes a Keypair from the secret key stored in environment variables. Essential for signing transactions.
    initializeKeypair(pk: any): Keypair {
        const privateKey = new Uint8Array(pk);
        const keypair = Keypair.fromSecretKey(privateKey);
        console.log(
            `Initialized Keypair: Public Key - ${keypair.publicKey.toString()}`
        );
        return keypair;
    }

    // TODO: not working for accounts that do not have a USDC balance
    // Main function orchestrates sending tokens by calling the defined functions in order.
    async transfer(sender: string, receiver: string, amount: number) {
        console.log("Starting Token Transfer Process");

        const connection = this.connection;
        const fromKeypair = this.initializeKeypair(Buffer.from(sender, 'base64'));
        const fromPayerKeypair = this.initializeKeypair(bs58.decode(this.configService.get('solana.privateKey') || ''));

        // Address receiving the tokens
        const destinationWallet = new PublicKey(receiver);

        // Config priority fee and amount to transfer
        const PRIORITY_RATE = 12345; // MICRO_LAMPORTS
        const transferAmount = amount; // Amount to transfer in USDC

        // Instruction to set the compute unit price for priority fee
        const PRIORITY_FEE_INSTRUCTIONS = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: PRIORITY_RATE });

        console.log("----------------------------------------");
        // const decimals = await this.getNumberDecimals(mintAddress, connection);
        const decimals = await this.getNumberDecimals(USDC_DEVNET_MINT); // Assuming the token has 6 decimals

        let sourceAccount
        try {
            // Creates or fetches the associated token accounts for the sender and receiver.
            sourceAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                fromPayerKeypair,
                USDC_DEVNET_MINT,
                fromKeypair.publicKey
            );
            console.log(`Source Account: ${sourceAccount.address.toString()}`);
        } catch (error) {
            console.log("🚀 ~ WalletService ~ transfer ~ error 1:", error)
        }

        let destinationAccount
        try {
            destinationAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                fromPayerKeypair,
                USDC_DEVNET_MINT,
                destinationWallet
            );
            console.log(`Destination Account: ${destinationAccount.address.toString()}`);
            console.log("----------------------------------------");
        } catch (error) {
            console.log("🚀 ~ WalletService ~ transfer ~ error 2:", error)
        }

        // Adjusts the transfer amount according to the token's decimals to ensure accurate transfers.
        const transferAmountInDecimals = transferAmount * Math.pow(10, decimals);

        // Prepares the transfer instructions with all necessary information.
        const transferInstruction = createTransferInstruction(
            // Those addresses are the Associated Token Accounts belonging to the sender and receiver
            sourceAccount.address,
            destinationAccount.address,
            fromKeypair.publicKey,
            transferAmountInDecimals
        );
        console.log(
            `Transaction instructions: ${JSON.stringify(transferInstruction)}`
        );
        let latestBlockhash = await connection.getLatestBlockhash("confirmed");

        // Compiles and signs the transaction message with the sender's Keypair.
        const messageV0 = new TransactionMessage({
            payerKey: fromPayerKeypair.publicKey,
            recentBlockhash: latestBlockhash.blockhash,
            instructions: [PRIORITY_FEE_INSTRUCTIONS, transferInstruction],
        }).compileToV0Message();
        const versionedTransaction = new VersionedTransaction(messageV0);
        versionedTransaction.sign([fromKeypair, fromPayerKeypair]);
        console.log("Transaction Signed. Preparing to send...");

        // Attempts to send the transaction to the network, handling success or failure.
        try {
            const txid = await connection.sendTransaction(versionedTransaction, {
                maxRetries: 20,
            });
            console.log(`Transaction Submitted: ${txid}`);

            const confirmation = await connection.confirmTransaction(
                {
                    signature: txid,
                    blockhash: latestBlockhash.blockhash,
                    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
                },
                "confirmed"
            );
            if (confirmation.value.err) {
                throw new Error("🚨Transaction not confirmed.");
            }
            console.log(
                `Transaction Successfully Confirmed! 🎉 View on SolScan: https://solscan.io/tx/${txid}`
            );

            return txid
        } catch (error) {
            console.error("Transaction failed", error);
        }
    }

    async mint(receiver: string, amount: number) {
        console.log("Starting Token Minting Process");

        const connection = this.connection;
        const mintAuthorityKeypair = this.initializeKeypair(bs58.decode(this.configService.get('ecorydes.authority') || '')); // Mint authority
        const destinationWallet = new PublicKey(receiver);

        // Config priority fee and amount to mint
        const PRIORITY_RATE = 12345; // MICRO_LAMPORTS
        const mintAmount = amount; // Amount to mint in SPL tokens

        // Instruction to set the compute unit price for priority fee
        const PRIORITY_FEE_INSTRUCTIONS = ComputeBudgetProgram.setComputeUnitPrice({ microLamports: PRIORITY_RATE });

        console.log("----------------------------------------");
        const decimals = await this.getNumberDecimals(ERD_DEVNET_MINT); // Assuming the token has 6 decimals

        let destinationAccount;
        try {
            // Creates or fetches the associated token account for the receiver.
            destinationAccount = await getOrCreateAssociatedTokenAccount(
                connection,
                mintAuthorityKeypair,
                ERD_DEVNET_MINT,
                destinationWallet,
                undefined, // allowOwnerOffCurve
                undefined, // commitment
                undefined, // confirmOptions
                TOKEN_2022_PROGRAM_ID // programId
            );
            console.log(`Destination Account: ${destinationAccount.address.toString()}`);
            console.log("----------------------------------------");
        } catch (error) {
            console.log("🚀 ~ WalletService ~ mint ~ error:", error);
            throw new Error("Failed to create or fetch destination account");
        }

        // Adjusts the mint amount according to the token's decimals to ensure accurate minting.
        const mintAmountInDecimals = Math.floor(mintAmount * Math.pow(10, decimals));

        // Prepares the mint instructions with all necessary information.
        const mintInstruction = createMintToInstruction(
            ERD_DEVNET_MINT,
            destinationAccount.address,
            mintAuthorityKeypair.publicKey,
            mintAmountInDecimals,
            undefined,
            TOKEN_2022_PROGRAM_ID
        );
        console.log(
            `Mint instructions: ${JSON.stringify(mintInstruction)}`
        );

        let latestBlockhash = await connection.getLatestBlockhash("confirmed");

        // Compiles and signs the transaction message with the mint authority's Keypair.
        const messageV0 = new TransactionMessage({
            payerKey: mintAuthorityKeypair.publicKey,
            recentBlockhash: latestBlockhash.blockhash,
            instructions: [PRIORITY_FEE_INSTRUCTIONS, mintInstruction],
        }).compileToV0Message();
        const versionedTransaction = new VersionedTransaction(messageV0);
        versionedTransaction.sign([mintAuthorityKeypair]);
        console.log("Transaction Signed. Preparing to send...");

        // Attempts to send the transaction to the network, handling success or failure.
        try {
            const txid = await connection.sendTransaction(versionedTransaction, {
                maxRetries: 20,
            });
            console.log(`Transaction Submitted: ${txid}`);

            const confirmation = await connection.confirmTransaction(
                {
                    signature: txid,
                    blockhash: latestBlockhash.blockhash,
                    lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
                },
                "confirmed"
            );
            if (confirmation.value.err) {
                throw new Error("🚨Transaction not confirmed.");
            }
            console.log(
                `Transaction Successfully Confirmed! 🎉 View on SolScan: https://solscan.io/tx/${txid}`
            );

            return txid;
        } catch (error) {
            console.error("Transaction failed", error);
            throw new Error("Minting transaction failed");
        }
    }
}