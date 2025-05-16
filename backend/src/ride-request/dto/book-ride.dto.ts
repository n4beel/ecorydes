import { IsNotEmpty, IsObject } from 'class-validator';
import { Location } from 'src/entities/ride-request.schema';

export class BookRideDto {
    @IsNotEmpty()
    @IsObject()
    pickup: Location;

    @IsNotEmpty()
    @IsObject()
    dropoff: Location;
}