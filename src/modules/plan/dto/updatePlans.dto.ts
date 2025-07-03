import {
  IsString,
  IsInt,
  IsArray,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class UpdatePlanDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsInt()
  @IsOptional()
  price?: number;

  @IsInt()
  @IsOptional()
  durationDays?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  features?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
