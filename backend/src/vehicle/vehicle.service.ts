import { Injectable } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Vehicle } from 'src/entities/vehicle.schema';

@Injectable()
export class VehicleService {
  constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>
  ) { }

  // Create a new Vehicle entry
  async create(createVehicleDto: CreateVehicleDto, userId: string): Promise<Vehicle> {
    const newVehicle = new this.vehicleModel({ userId: new Types.ObjectId(userId), ...createVehicleDto });
    return newVehicle.save();
  }

  findAll() {
    return this.vehicleModel.find().exec();
  }

  findAllByOwner(userId: string) {
    return this.vehicleModel.find({ userId: new Types.ObjectId(userId) }).exec();
  }

  findOne(id: string) {
    return this.vehicleModel.findById(id).exec();
  }

  update(id: string, updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleModel.findByIdAndUpdate(id, updateVehicleDto, { new: true }).exec();
  }

  remove(id: string) {
    return this.vehicleModel.findByIdAndDelete(id).exec();
  }
}
