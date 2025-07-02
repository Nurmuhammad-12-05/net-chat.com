import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';
import { CreateChatDto } from './dto/create.chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly db: DatabaseService) {}

  async getUserChats(userId: string) {
    return await this.db.prisma.chat.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                isOnline: true,
              },
            },
          },
        },
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  async getChatById(id: string) {
    const chat = this.db.prisma.chat.findUnique({
      where: { id },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 20,
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
        },
      },
    });

    if (!chat) {
      throw new NotFoundException('Chat topilmadi');
    }

    return { chat };
  }

  async createChat(dto: CreateChatDto) {
    const { name, type, participants } = dto;

    if (type === 'DIRECT' && participants.length !== 2) {
      throw new BadRequestException(
        'DIRECT chat faqat 2 ishtirokchi bilan bo‘lishi mumkin',
      );
    }

    const chat = await this.db.prisma.chat.create({
      data: {
        name: type === 'GROUP' ? name : null,
        type,
        participants: {
          create: participants.map((userId) => ({
            user: { connect: { id: userId } },
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
              },
            },
          },
        },
      },
    });

    return chat;
  }
}
