import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getModelToken } from '@nestjs/mongoose';
import { Admin, AdminDocument } from '../entities/admin.schema';
import { Model } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { Status } from '../common/enums/status.enum';
import { Role } from '../common/enums/role.enum';

describe('AdminService', () => {
  let service: AdminService;
  let model: Model<Admin>;

  const mockAdmin = {
    _id: 'some-user-id',
    email: 'test@example.com',
    password: 'hashedPassword',
    status: Status.invited,
    roles: [Role.user],
    twoFactorEnabled: false,
  };

  const mockAdminModel = {
    create: jest.fn(),
    findById: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: getModelToken(Admin.name),
          useValue: mockAdminModel,
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    model = module.get<Model<Admin>>(getModelToken(Admin.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneById', () => {
    it('should return a user if found', async () => {
      mockAdminModel.findById.mockResolvedValue(mockAdmin);
      const result = await service.findOneById('some-user-id');
      expect(result).toEqual(mockAdmin);
      expect(mockAdminModel.findById).toHaveBeenCalledWith('some-user-id');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockAdminModel.findById.mockResolvedValue(null);
      await expect(service.findOneById('non-existent-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user if found', async () => {
      mockAdminModel.findOne.mockResolvedValue(mockAdmin);
      const result = await service.findOneByEmail('test@example.com');
      expect(result).toEqual(mockAdmin);
      expect(mockAdminModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should throw NotFoundException if user not found', async () => {
      mockAdminModel.findOne.mockResolvedValue(null);
      await expect(service.findOneByEmail('nonexistent@example.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createOne', () => {
    it('should create and return a new user', async () => {
      const newAdmin = {
        email: 'new@example.com',
        password: 'password123',
        status: Status.invited,
        roles: [Role.user],
      };
      mockAdminModel.create.mockResolvedValue(newAdmin);

      const result = await service.createOne(newAdmin as Admin);
      expect(result).toEqual(newAdmin);
      expect(mockAdminModel.create).toHaveBeenCalledWith(newAdmin);
    });
  });

  describe('updateByEmail', () => {
    it('should update and return the user if found', async () => {
      const updateData = {
        status: Status.accepted,
        twoFactorEnabled: true,
      };
      mockAdminModel.findOneAndUpdate.mockResolvedValue({ ...mockAdmin, ...updateData });

      const result = await service.updateByEmail('test@example.com', updateData as Admin);
      expect(result).toEqual({ ...mockAdmin, ...updateData });
      expect(mockAdminModel.findOneAndUpdate).toHaveBeenCalledWith(
        { email: 'test@example.com' },
        updateData,
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      mockAdminModel.findOneAndUpdate.mockResolvedValue(null);
      await expect(
        service.updateByEmail('nonexistent@example.com', {} as Admin),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
