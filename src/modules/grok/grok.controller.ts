import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GroqService } from './grok.service';
import { CreateChatAiDto } from './dto/create.chat.ai.dto';

@Controller('groq')
export class GroqController {
  constructor(private readonly groqService: GroqService) {}

  @Post('/chat')
  async chat(@Body() body: CreateChatAiDto) {
    const prompt: string = body.prompt;

    return await this.groqService.generateText(prompt);
  }

  @Get('/chat-ai/ansquery')
  async getAllAnsquery() {
    return await this.groqService.getAllAnsquery();
  }
}
