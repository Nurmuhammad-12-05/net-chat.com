import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserStatus } from '@prisma/client';

export class UpdateUserSelfDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsArray()
  skills?: string[];

  @IsOptional()
  @IsArray()
  tags?: string[];
}

// ADMIN/SUPERADMIN only
export class UpdateUserByAdminDto {
  @IsOptional()
  @IsEnum(UserStatus)
  status?: UserStatus;
}
