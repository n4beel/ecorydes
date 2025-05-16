import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/entities/user.schema';
import { Model } from 'mongoose';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { AddIdDto } from './dto/add-id.dto';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { WalletService } from 'src/wallet/wallet.service';
import { decryptData } from 'src/common/helpers/cryptography';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private readonly vehicleService: VehicleService,
    private readonly walletService: WalletService,
    private readonly configService: ConfigService
  ) { }

  // Create a new user entry
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;
    const user = await this.userModel.findOneAndUpdate(
      { email },
      { $setOnInsert: createUserDto },
      { new: true, upsert: true }
    ).exec();

    const wallet = await this.walletService.createUserWallet(user._id.toString());

    return user;
  }

  // Retrieve paginated user entries
  async findAll(paginatedDto: PaginatedDto): Promise<{
    data: User[],
    page: number,
    totalPages: number,
    total: number
  }> {
    const { page = 1, limit = 10 } = paginatedDto;  // Set default values if page/limit are not provided
    const skip = (page - 1) * limit;  // Calculate how many documents to skip

    const data = await this.userModel.find()
      .skip(skip)  // Skip the first (page - 1) * limit documents
      .limit(limit)  // Limit the number of documents returned
      .exec();

    const total = await this.userModel.countDocuments().exec();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      totalPages,
      total
    };
  }

  // Retrieve a single user entry by ID
  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async getLoggedInUser(id: string): Promise<User & {
    vehicles: any[],
    balance: number,
    credits: number,
    lockedBalance: number,
    publicKey: string
  }> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // Get all vehicles for the user
    const vehicles = await this.vehicleService.findAllByOwner(id);
    const balance = await this.walletService.getUserUsdcBalance(id);
    const credits = await this.walletService.getUserErdBalance(id);
    const { publicKey, lockedBalance } = await this.walletService.getUserWallet(id);

    return { ...user.toObject(), vehicles, balance, credits, publicKey, lockedBalance };
  }

  async getUserBalance(id: string): Promise<{
    balance: number,
    credits: number,
    lockedBalance: number,
    publicKey: string
  }> {
    const balance = await this.walletService.getUserUsdcBalance(id)
    const credits = await this.walletService.getUserErdBalance(id);
    const { publicKey, lockedBalance } = await this.walletService.getUserWallet(id);

    return {
      balance,
      credits,
      publicKey,
      lockedBalance
    }
  }

  async getUserWallet(id: string): Promise<{
    balance: number,
    lockedBalance: number,
    publicKey: string,
  }> {
    const balance = await this.walletService.getUserUsdcBalance(id)
    const { publicKey, lockedBalance, encryptedPrivateKey } = await this.walletService.getUserWallet(id);

    return {
      balance,
      publicKey,
      lockedBalance,
    }
  }

  // Update a user entry
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return updatedUser;
  }

  // Remove a user entry
  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async addIdentityDocument(id: string, addIdDto: AddIdDto): Promise<User> {
    // check if id dcoument already exists
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (!!user?.idDocument?.idType) {
      throw new NotFoundException(`User with ID ${id} already has added an ID document`);
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { $addToSet: { idDocument: addIdDto } },
      { new: true }
    ).exec();

    return updatedUser;
  }
}
