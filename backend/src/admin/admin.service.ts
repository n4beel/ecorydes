import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admin, AdminDocument } from 'src/entities/admin.schema';

@Injectable()
export class AdminService {
    private readonly logger = new Logger(AdminService.name);
    constructor(
        @InjectModel(Admin.name) private adminModel: Model<Admin>
    ) {
        this.logger.verbose('AdminService Initialized.');
    }

    findOneById = async (id: string): Promise<AdminDocument | undefined> => {
        const admin = await this.adminModel.findById(id);
        if (!admin) {
            throw new NotFoundException('Admin does not exist.')
        }
        return admin
    }

    findOneByEmail = async (email: string): Promise<AdminDocument | undefined> => {
        const admin = await this.adminModel.findOne({ email });
        if (!admin) {
            throw new NotFoundException('Admin does not exist.')
        }
        return admin;
    }

    createOne = async (adminProps: Admin): Promise<AdminDocument> => {
        return await this.adminModel.create(adminProps);
    }

    updateByEmail = async (email: string, adminProps: Admin): Promise<AdminDocument | undefined> => {
        const admin = await this.adminModel.findOneAndUpdate({ email }, adminProps)
        if (!admin) {
            throw new NotFoundException('Admin does not exist.')
        }
        return admin;
    }
}
