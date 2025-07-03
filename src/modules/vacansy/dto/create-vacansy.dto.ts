import { Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
  IsDefined,
  IsNumber,
} from 'class-validator';

export class CreateVacancyDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  salary?: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  requirements: string[];
}
