import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { IsEmail, IsNumber, IsObject, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

export type UserDocument = HydratedDocument<User>;

export type IdType = "id_card" | "driver_license";

export class IdDocument {
    @Prop()
    @IsUrl()
    idFrontImage?: string;

    @Prop()
    @IsUrl()
    idBackImage?: string;

    @Prop()
    @IsString()
    idType?: IdType;
}

@Schema({
    timestamps: true
})
export class User {
    @Prop()
    @IsString()
    publicKey?: string;

    @Prop()
    @IsString()
    privateKey?: string;

    @Prop({
        index: true,
        unique: true
    })
    @IsEmail()
    email?: string;

    @Prop()
    @IsString()
    socialId?: string;

    @Prop()
    @IsString()
    givenName?: string;

    @Prop()
    @IsString()
    familyName?: string;

    @Prop()
    @IsString()
    name?: string;

    @Prop({
        default: "https://res.cloudinary.com/n4beel1/image/upload/v1732710682/user-icon-placeholder-1_x2ftw5.png"
    })
    @IsUrl()
    photo?: string;

    @Prop()
    @IsString()
    address1?: string;

    @Prop()
    @IsString()
    address2?: string;

    @Prop()
    @IsString()
    city?: string;

    @Prop()
    @IsString()
    state?: string;

    @Prop()
    @IsString()
    postalCode?: string;

    @Prop()
    @IsString()
    country?: string;

    @Prop()
    @IsObject()
    idDocument?: IdDocument;

    @Prop({
        default: 0
    })
    @IsNumber()
    rating?: number;

    @Prop()
    @IsString()
    phoneNumber?: string;
}

export const UserSchema = SchemaFactory.createForClass(User)