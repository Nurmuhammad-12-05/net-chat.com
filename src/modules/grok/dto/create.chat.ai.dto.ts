import { IsString } from 'class-validator';

export class CreateChatAiDto {
  @IsString()
  prompt: string;
}
