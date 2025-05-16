import { IntersectionType } from '@nestjs/mapped-types';
import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword, IsUrl } from 'class-validator';

const passwordValidation = {
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
}

const passValidationMessage = "password must be more than 8 characters and must contain an uppercase letter, a lowercase letter, a number and a special character"

export class EmailDto {
    @IsNotEmpty()
    @IsEmail({}, { message: "email is not valid" })
    email: string;
}

export class PasswordDto {
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword(passwordValidation, {
        message: passValidationMessage
    })
    password: string;
}

export class UpdatePassDto extends PasswordDto {
    @IsNotEmpty()
    @IsString()
    @IsStrongPassword(passwordValidation, {
        message: passValidationMessage
    })
    newPassword: string;
}

export class Web3AuthDto {
    @IsString()
    @IsNotEmpty()
    token: string;
}

export class AuthDto extends IntersectionType(EmailDto, PasswordDto) { }

export class TwoFactorDto {
    @IsString()
    @IsNotEmpty()
    token: string;
}

export class TwoFactorAuthDto extends IntersectionType(AuthDto, TwoFactorDto) { }

export class SocialAuthDto extends EmailDto {
    @IsUrl()
    @IsOptional()
    photo?: string;

    @IsString()
    @IsOptional()
    givenName?: string;

    @IsString()
    @IsOptional()
    familyName?: string;

    @IsString()
    @IsOptional()
    name: string;

    @IsString()
    @IsNotEmpty()
    socialId: string;
}