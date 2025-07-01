import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateRegisterDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsStrongPassword()
  @IsString()
  password: string;
}
