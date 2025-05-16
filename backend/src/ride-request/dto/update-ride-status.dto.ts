import { IsString } from 'class-validator';
import { PassengerStatus, RideStatus } from 'src/entities/ride-request.schema';

export class UpdateRideStatusByDriverDto {
    @IsString()
    rideStatus: RideStatus;
}
export class UpdateRideStatusByPassengerDto {
    @IsString()
    passengerStatus: PassengerStatus;
}