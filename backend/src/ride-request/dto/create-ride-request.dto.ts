import { IsBoolean, IsDate, IsMongoId, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class LocationDto {
    @IsObject()
    @ValidateNested()
    @Type(() => String)
    address: string;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;

    @IsOptional()
    @IsString()
    city?: string;
}

export class CreateRideRequestDto {
    @IsNotEmpty()
    @IsObject()
    @Type(() => LocationDto)
    startLocation: LocationDto;

    @IsNotEmpty()
    @IsObject()
    @Type(() => LocationDto)
    endLocation: LocationDto;

    @IsNotEmpty()
    @IsBoolean()
    returnTrip: boolean;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate()
    startTime: Date;

    @Type(() => Date)
    @IsDate()
    endTime?: Date;

    @IsNotEmpty()
    @IsNumber()
    cost: number;

    @IsNotEmpty()
    @IsNumber()
    seats: number;

    @IsNotEmpty()
    @IsBoolean()
    isRecurring: boolean;

    @IsNotEmpty()
    @IsObject()
    days: Record<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday', boolean>;

    validate() {
        if (this.isRecurring && !this.days) {
            throw new Error('days is required when isRecurring is true.');
        }
        if (this.returnTrip && !this.endTime) {
            throw new Error('endTime is required for return trips.');
        }
        if (this.endTime && this.endTime <= this.startTime) {
            throw new Error('endTime must be greater than startTime.');
        }
    }
}
