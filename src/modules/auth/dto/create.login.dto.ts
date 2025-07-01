import { IsEmail, IsString, IsStrongPassword } from 'class-validator';

export class CreateLoginDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsStrongPassword()
  @IsString()
  password: string;
}
