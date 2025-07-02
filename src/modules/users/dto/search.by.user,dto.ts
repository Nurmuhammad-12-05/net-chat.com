import { IsOptional, IsString, IsInt, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchByUsernameDto {
  @IsString()
  @MinLength(2, { message: "Username kamida 2 ta harf bo'lishi kerak" })
  username: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 20;
}
