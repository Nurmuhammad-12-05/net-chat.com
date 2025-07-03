import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { Request } from 'express';
import { CreateChatDto } from './dto/create.chat.dto';
import { GetMessagesQueryDto } from '../message/dto/get.messages.query.chat.dto';
import { BlockGuard } from 'src/common/guard/block.guard';

@Controller('/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  async getChats(@Req() req: Request) {
    const userId = req['userId'];
    return await this.chatService.getUserChats(userId);
  }

  @Get('get/:id')
  async getChatById(@Param('id') id: string) {
    const chat = await this.chatService.getChatById(id);

    return chat;
  }

  @Post('/create-chat')
  @UseGuards(BlockGuard)
  async createChat(@Body() dto: CreateChatDto) {
    return await this.chatService.createChat(dto);
  }
}
