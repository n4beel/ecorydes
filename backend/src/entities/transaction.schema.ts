import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { IsNumber, IsString } from 'class-validator';

export type TransactionDocument = HydratedDocument<Transaction>;

@Schema({
    timestamps: true
})
export class Transaction {
    @Prop({ default: '' })
    @IsString()
    reference: string;

    @Prop({ default: 0 })
    @IsNumber()
    price: number;

    @Prop({ default: 0 })
    @IsNumber()
    score: number;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction)