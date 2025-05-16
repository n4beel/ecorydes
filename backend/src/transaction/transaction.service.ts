import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaginatedDto } from 'src/common/dto/paginated.dto';
import { Transaction } from 'src/entities/transaction.schema';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>
  ) { }

  // Create a new transaction entry
  async create(createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const newTransaction = new this.transactionModel(createTransactionDto);
    return newTransaction.save();
  }

  // Retrieve paginated transaction entries
  async findAll(paginatedDto: PaginatedDto): Promise<{
    data: Transaction[],
    page: number,
    totalPages: number,
    total: number
  }> {
    const { page = 1, limit = 10 } = paginatedDto;  // Set default values if page/limit are not provided
    const skip = (page - 1) * limit;  // Calculate how many documents to skip

    const data = await this.transactionModel.find()
      .skip(skip)  // Skip the first (page - 1) * limit documents
      .limit(limit)  // Limit the number of documents returned
      .exec();

    const total = await this.transactionModel.countDocuments().exec();
    const totalPages = Math.ceil(total / limit);

    return {
      data,
      page,
      totalPages,
      total
    };
  }

  // Retrieve a single transaction entry by ID
  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  // Update a transaction entry
  async update(id: string, updateTransactionDto: UpdateTransactionDto): Promise<Transaction> {
    const updatedTransaction = await this.transactionModel.findByIdAndUpdate(id, updateTransactionDto, { new: true }).exec();
    if (!updatedTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return updatedTransaction;
  }

  // Remove a transaction entry
  async remove(id: string): Promise<void> {
    const result = await this.transactionModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
  }
}
