import { IsNotEmpty, IsString, IsUrl } from 'class-validator';
import { IdType } from 'src/entities/user.schema';

export class AddIdDto {
    @IsNotEmpty()
    @IsUrl()
    idFrontImage: string;

    @IsNotEmpty()
    @IsUrl()
    idBackImage: string;

    @IsNotEmpty()
    @IsString()
    idType: IdType;
}