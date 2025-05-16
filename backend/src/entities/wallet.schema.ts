import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { IsNotEmpty, IsString, IsNumber, Min, IsMongoId } from 'class-validator';

@Schema({ timestamps: true })
export class Wallet extends Document {
    @Prop({ required: true, unique: true })
    @IsNotEmpty()
    @IsMongoId()
    userId: Types.ObjectId;

    @Prop({ required: true })
    @IsNotEmpty()
    @IsString()
    publicKey: string;

    @Prop({ required: true })
    @IsNotEmpty()
    @IsString()
    encryptedPrivateKey: string;

    @Prop({ required: true, default: 0 })
    @IsNotEmpty()
    @IsNumber()
    @Min(0)
    lockedBalance: number;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);