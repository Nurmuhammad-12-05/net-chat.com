import {
  IsString,
  IsInt,
  IsArray,
  IsBoolean,
  IsOptional,
  ArrayMinSize,
} from 'class-validator';

export class PlanDto {
  @IsString()
  name: string;

  @IsInt()
  price: number;

  @IsInt()
  durationDays: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  features: string[];

  @IsBoolean()
  @IsOptional()
  isActive: boolean;
}
