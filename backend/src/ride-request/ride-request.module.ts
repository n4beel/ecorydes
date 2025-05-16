import { Module } from '@nestjs/common';
import { RideRequestService } from './ride-request.service';
import { RideRequestController } from './ride-request.controller';
import { VehicleModule } from 'src/vehicle/vehicle.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RideRequest, RideRequestSchema } from 'src/entities/ride-request.schema';
import { UserModule } from 'src/user/user.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { RoomsService } from 'src/services/rooms/rooms.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: RideRequest.name, schema: RideRequestSchema }]),
    VehicleModule,
    UserModule,
    WalletModule
  ],
  controllers: [RideRequestController],
  providers: [RideRequestService, RoomsService],
})
export class RideRequestModule { }
