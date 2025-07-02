import { Injectable } from '@nestjs/common';
import {
  ChatType,
  EventCategory,
  EventStatus,
  Prisma,
  UserRole,
  UserStatus,
} from '@prisma/client';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}

  async getStats() {
    const [
      totalUsers,
      activeUsers,
      companies,
      tutors,
      events,
      messages,
      chats,
      posts,
    ] = await Promise.all([
      this.db.prisma.user.count(),
      this.db.prisma.user.count({ where: { status: UserStatus.ACTIVE } }),
      this.db.prisma.user.count({ where: { role: UserRole.COMPANY } }),
      this.db.prisma.user.count({ where: { role: UserRole.TUTOR } }),
      this.db.prisma.event.count(),
      this.db.prisma.message.count(),
      this.db.prisma.chat.count(),
      this.db.prisma.post.count(),
    ]);

    return {
      totalUsers,
      activeUsers,
      companies,
      tutors,
      events,
      messages,
      chats,
      posts,
    };
  }

  async getUsers(params: {
    search?: string;
    page: number;
    limit: number;
    role?: UserRole;
    status?: string;
  }) {
    const { search, page, limit, role, status } = params;

    const where: Prisma.UserWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { username: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        role ? { role } : {},
        status ? { status: status as UserStatus } : {},
      ],
    };

    const [total, users] = await this.db.prisma.$transaction([
      this.db.prisma.user.count({ where }),
      this.db.prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      users,
    };
  }

  async getAdminEvents(params: {
    search?: string;
    page: number;
    limit: number;
    category?: string;
    status?: string;
  }) {
    const { search, page, limit, category, status } = params;

    const where: Prisma.EventWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { location: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        category ? { category: category as EventCategory } : {},
        status ? { status: status as EventStatus } : {},
      ],
    };

    const [total, events] = await this.db.prisma.$transaction([
      this.db.prisma.event.count({ where }),
      this.db.prisma.event.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          organizer: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      events,
    };
  }

  async getAdminChats(params: {
    search?: string;
    type?: string;
    page: number;
    limit: number;
  }) {
    const { search, type, page, limit } = params;

    const where: Prisma.ChatWhereInput = {
      AND: [
        type ? { type: type as ChatType } : {},
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                {
                  participants: {
                    some: {
                      user: {
                        name: { contains: search, mode: 'insensitive' },
                      },
                    },
                  },
                },
              ],
            }
          : {},
      ],
    };

    const [total, chats] = await this.db.prisma.$transaction([
      this.db.prisma.chat.count({ where }),
      this.db.prisma.chat.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          participants: {
            select: {
              user: {
                select: { id: true, name: true, avatar: true },
              },
            },
          },
          _count: {
            select: { messages: true },
          },
        },
      }),
    ]);

    return {
      total,
      page,
      limit,
      chats,
    };
  }
}
