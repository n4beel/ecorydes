import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { IsBoolean, IsDate, IsMongoId, IsNumber, IsObject, IsString } from 'class-validator';

export type RideRequestDocument = HydratedDocument<RideRequest>;

export type PassengerStatus = "pending" | "picked" | "dropped" | "cancelled";
export type RideStatus = "pending" | "started" | "completed" | "cancelled";

export interface LocationType {
    latitude: number;
    longitude: number;
}

export class Location {
    @Prop()
    @IsString()
    address: string;

    @Prop()
    @IsString()
    city: string;

    @Prop()
    @IsNumber()
    latitude: number;

    @Prop()
    @IsNumber()
    longitude: number;
}

export class Passenger {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    @IsMongoId()
    passengerId: Types.ObjectId;

    @Prop()
    @IsObject()
    pickup: Location;

    @Prop()
    @IsObject()
    dropoff: Location;

    @Prop({ default: 0, min: 1, max: 5 })
    @IsNumber()
    driverRating?: number;

    @Prop({ default: 0, min: 1, max: 5 })
    @IsNumber()
    passengerRating?: number;

    @Prop({ default: "pending" })
    @IsString()
    status?: PassengerStatus;

    @Prop({ default: false })
    @IsBoolean()
    trip1Completed?: boolean;

    @Prop({ default: false })
    @IsBoolean()
    creditsCollected: boolean;
}

@Schema({
    timestamps: true
})
export class RideRequest {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    @IsMongoId()
    userId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'Vehicle' })
    @IsMongoId()
    vehicleId: Types.ObjectId;

    @Prop({ default: false })
    @IsBoolean()
    returnTrip: boolean;

    @Prop()
    @IsObject()
    startLocation: Location;

    @Prop()
    @IsObject()
    endLocation: Location;

    @Prop()
    @IsDate()
    startTime: Date;

    @Prop()
    @IsDate()
    endTime: Date;

    @Prop()
    validateEndTime() {
        if (this.startTime && this.endTime && this.endTime <= this.startTime) {
            throw new Error("endTime must be greater than startTime");
        }
    }

    @Prop({ default: 0 })
    @IsNumber()
    cost: number;

    @Prop({ default: 0 })
    @IsNumber()
    seats: number;

    @Prop({ default: 0 })
    @IsNumber()
    occupied: number;

    @Prop({ type: [Passenger] })
    @IsObject({ each: true })
    passengers: Passenger[];

    @Prop({ default: "pending" })
    @IsString()
    status: RideStatus;

    @Prop({ default: false })
    @IsBoolean()
    trip1Completed: boolean;

    @Prop({ default: false })
    @IsBoolean()
    farePaid: boolean;

    @Prop({ default: false })
    @IsBoolean()
    creditsCollected: boolean;

    driverRating?: number; // Add driverRating as an optional property

    @Prop({ default: 0 })
    @IsNumber()
    distance?: number;

    @Prop()
    @IsDate()
    startedAt1?: Date;

    @Prop()
    @IsDate()
    endedAt1?: Date;

    @Prop()
    @IsDate()
    startedAt2?: Date;

    @Prop()
    @IsDate()
    endedAt2?: Date;

    @Prop({ default: 0 })
    @IsNumber()
    co2Saved?: number;

    @Prop({ default: 0 })
    @IsNumber()
    duration?: number;
}

export const RideRequestSchema = SchemaFactory.createForClass(RideRequest)