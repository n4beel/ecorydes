import { IsMongoId, IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { Types } from 'mongoose';

export class CreateVehicleDto {
    @IsNotEmpty()
    @IsString()
    make: string;

    @IsNotEmpty()
    @IsString()
    model: string;

    @IsNotEmpty()
    @IsString()
    color: string;

    @IsNotEmpty()
    @IsString()
    registration: string;

    @IsNotEmpty()
    @IsUrl()
    image: string;
}
