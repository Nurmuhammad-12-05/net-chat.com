import { Type } from 'class-transformer';
import { IsString, IsOptional, IsInt, IsUUID } from 'class-validator';

export class CreateVacancyDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    location: string;

    @IsOptional()
    @Type(() => Number)
    salary?: number;

    @IsString()
    requirements: string;
}
