import {
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ArrayMinSize,
  IsArray,
} from 'class-validator';
import { ChatType } from '@prisma/client';

export class CreateChatDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEnum(ChatType, {
    message: 'Chat turi faqat DIRECT yoki GROUP bo‘lishi kerak',
  })
  type: ChatType;

  @IsArray()
  @ArrayMinSize(2, { message: 'Kamida 2 ta ishtirokchi bo‘lishi kerak' })
  @IsUUID('all', { each: true })
  participants: string[];
}
