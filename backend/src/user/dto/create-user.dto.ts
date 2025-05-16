import { IsEmail, IsString, IsUrl, IsOptional, IsNumber, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
    @IsOptional()
    @IsString({ message: 'Wallet address must be a string' })
    walletAddress?: string;

    @IsOptional()
    @IsEmail({}, { message: 'Email must be a valid email address' })
    email?: string;

    @IsOptional()
    @IsString({ message: 'Social ID must be a string' })
    socialId?: string;

    @IsOptional()
    @IsString({ message: 'Given name must be a string' })
    givenName?: string;

    @IsOptional()
    @IsString({ message: 'Family name must be a string' })
    familyName?: string;

    @IsOptional()
    @IsString({ message: 'Name must be a string' })
    name?: string;

    @IsOptional()
    @IsUrl({}, { message: 'Photo must be a valid URL' })
    photo?: string;

    @IsOptional()
    @IsString({ message: 'Address1 must be a string' })
    address1?: string;

    @IsOptional()
    @IsString({ message: 'Address2 must be a string' })
    address2?: string;

    @IsOptional()
    @IsString({ message: 'City must be a string' })
    city?: string;

    @IsOptional()
    @IsString({ message: 'State must be a string' })
    state?: string;

    @IsOptional()
    @IsString({ message: 'Postal code must be a string' })
    postalCode?: string;

    @IsOptional()
    @IsString({ message: 'Country must be a string' })
    country?: string;

    @IsOptional()
    @IsNumber()
    rating?: number;

    @IsOptional()
    @IsString({ message: 'Phone number must be a valid phone number' })
    phoneNumber?: string;
}
