import { IsMongoId, IsNumber, IsString, Max, Min } from 'class-validator';
import { Types } from 'mongoose';

export class RateRideDto {
    @IsString()
    ratingBy: "driver" | "passenger";

    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    ratingTo: string;
}