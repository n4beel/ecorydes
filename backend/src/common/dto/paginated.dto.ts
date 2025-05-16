import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class PaginatedDto {

    @IsOptional()
    @Transform(({ value }) => value?.toString().trim() || null)
    query?: string | null = null;

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => parseInt(value, 10) || 1) // Transform string to number, default to 1 if not valid
    page?: number = 1; // Default value if not provided

    @IsOptional()
    @IsNumber()
    @Min(1)
    @Transform(({ value }) => parseInt(value, 10) || 10) // Transform string to number, default to 10 if not valid
    limit?: number = 10; // Default value if not provided
}
