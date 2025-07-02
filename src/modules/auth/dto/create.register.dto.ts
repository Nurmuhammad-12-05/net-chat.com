import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateRegisterDto {
  @IsString()
  @IsOptional()
  @MaxLength(50)
  @MinLength(5)
  name?: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsStrongPassword()
  @IsString()
  password: string;
}
