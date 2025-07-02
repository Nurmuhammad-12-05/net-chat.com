import { IsString, MinLength } from 'class-validator';

export class UpdateMessageDto {
  @IsString()
  @MinLength(1, { message: 'Xabar mazmuni bo‘sh bo‘lmasligi kerak' })
  content: string;
}
