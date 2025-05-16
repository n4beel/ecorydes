import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { IsMongoId, IsNumber, IsString, IsUrl } from 'class-validator';

export type VehicleDocument = HydratedDocument<Vehicle>;

@Schema({
    timestamps: true
})
export class Vehicle {
    @Prop({ type: Types.ObjectId, ref: 'User' })
    @IsMongoId()
    userId: Types.ObjectId;

    @Prop({ default: '' })
    @IsString()
    make: string;

    @Prop({ default: '' })
    @IsString()
    model: string;

    @Prop({ default: '' })
    @IsString()
    color: string;

    @Prop({ default: '' })
    @IsString()
    registration: string;

    @Prop({ default: '' })
    @IsUrl()
    image: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle)