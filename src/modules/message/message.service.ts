import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';
import { GetMessagesQueryDto } from './dto/get.messages.query.chat.dto';
import { CreateMessageDto } from './dto/create.message.dto';
import { UpdateMessageDto } from './dto/update.message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly db: DatabaseService) {}

  async getMessagesByChatId(chatId: string, query: GetMessagesQueryDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const chat = await this.db.prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chat) {
      throw new NotFoundException('Chat topilmadi');
    }

    const messages = await this.db.prisma.message.findMany({
      where: { chatId },
      orderBy: { timestamp: 'desc' },
      skip,
      take: limit,
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return {
      chatId,
      page,
      limit,
      messages,
    };
  }

  async sendMessage(chatId: string, senderId: string, dto: CreateMessageDto) {
    const chat = await this.db.prisma.chat.findUnique({
      where: { id: chatId },
      include: {
        participants: {
          where: { userId: senderId },
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat topilmadi');
    }

    if (!chat.participants.length) {
      throw new ForbiddenException('Siz bu chatga a’zo emassiz');
    }

    const message = await this.db.prisma.message.create({
      data: {
        content: dto.content,
        chatId,
        senderId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    return {
      success: true,
      message,
    };
  }

  async updateMessage(
    messageId: string,
    userId: string,
    dto: UpdateMessageDto,
  ) {
    const message = await this.db.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Xabar topilmadi');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException(
        'Siz faqat o‘z xabaringizni tahrirlashingiz mumkin',
      );
    }

    const updated = await this.db.prisma.message.update({
      where: { id: messageId },
      data: {
        content: dto.content,
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      message: updated,
    };
  }

  async deleteMessage(messageId: string, userId: string) {
    const message = await this.db.prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) {
      throw new NotFoundException('Xabar topilmadi');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('Siz faqat o‘z xabaringizni o‘chira olasiz');
    }

    await this.db.prisma.message.delete({
      where: { id: messageId },
    });

    return {
      success: true,
      message: 'Xabar o‘chirildi',
    };
  }
}
