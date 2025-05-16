import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { IsNumber, IsString } from 'class-validator';

export type SettingsDocument = HydratedDocument<Settings>;

export const defaultSettings = {
    scoreToStableCost: 1,
    fiatToScoreCost: 1,
    hintCost: 5,
    skipCost: 10,
    retryCost: 10,
    retryAllowed: 3,
    scoreForCorrectAnswer: 1,
}

@Schema()
export class Settings {
    @Prop({ default: defaultSettings.scoreToStableCost })
    @IsNumber()
    scoreToStableCost: number;

    @Prop({ default: defaultSettings.fiatToScoreCost })
    @IsNumber()
    fiatToScoreCost: number;

    @Prop({ default: defaultSettings.hintCost })
    @IsNumber()
    hintCost: number;

    @Prop({ default: defaultSettings.skipCost })
    @IsNumber()
    skipCost: number;

    @Prop({ default: defaultSettings.retryCost })
    @IsNumber()
    retryCost: number;

    @Prop({ default: defaultSettings.retryAllowed })
    @IsNumber()
    retryAllowed: number;

    @Prop({ default: defaultSettings.scoreForCorrectAnswer })
    @IsNumber()
    scoreForCorrectAnswer: number;

}

export const SettingsSchema = SchemaFactory.createForClass(Settings)