import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";
import { Role } from "src/common/enums/role.enum";
import { IsArray, IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { Status } from "src/common/enums/status.enum";

export type AdminDocument = HydratedDocument<Admin>;

@Schema()
export class Admin {
    @Prop({
        index: true,
        unique: true
    })
    @IsEmail()
    email: string;

    @Prop()
    @IsString()
    password?: string;

    @Prop()
    @IsArray()
    oldPasswords?: string[];

    @Prop()
    @IsArray()
    recoveryCodes?: string[];

    @Prop({
        default: Status.invited
    })
    @IsEnum(Status)
    status?: Status;

    @Prop()
    @IsEnum(Role, { each: true })
    @IsArray()
    roles?: Role[];

    @Prop({
        default: false
    })
    @IsBoolean()
    twoFactorEnabled?: boolean;

    @Prop()
    @IsString()
    twoFactorSecret?: string;
}

export const AdminSchema = SchemaFactory.createForClass(Admin)