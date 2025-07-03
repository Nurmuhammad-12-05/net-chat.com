import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { GetMessagesQueryDto } from './dto/get.messages.query.chat.dto';
import { Request } from 'express';
import { CreateMessageDto } from './dto/create.message.dto';
import { UpdateMessageDto } from './dto/update.message.dto';
import { BlockGuard } from 'src/common/guard/block.guard';

@Controller('/message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Get('get/:id/messages')
  async getChatMessages(
    @Param('id') chatId: string,
    @Query() query: GetMessagesQueryDto,
  ) {
    return await this.messageService.getMessagesByChatId(chatId, query);
  }

  @Post('create/:id/messages')
  @UseGuards(BlockGuard)
  async sendMessage(
    @Param('id') chatId: string,
    @Body() dto: CreateMessageDto,
    @Req() req: Request,
  ) {
    const userId = req['userId'];
    return await this.messageService.sendMessage(chatId, userId, dto);
  }

  @Put('update/:id')
  @UseGuards(BlockGuard)
  async updateMessage(
    @Param('id') id: string,
    @Body() dto: UpdateMessageDto,
    @Req() req: Request,
  ) {
    const userId = req['userId'];
    return await this.messageService.updateMessage(id, userId, dto);
  }

  @Delete('delete/:id')
  @UseGuards(BlockGuard)
  async deleteMessage(@Param('id') id: string, @Req() req: Request) {
    const userId = req['userId'];
    return await this.messageService.deleteMessage(id, userId);
  }
}
