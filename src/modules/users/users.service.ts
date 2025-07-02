import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';
import { UpdateUserByAdminDto, UpdateUserSelfDto } from './dto/update.user.dto';
import { SearchUserDto } from './dto/search.user.dto';
import { SearchByUsernameDto } from './dto/search.by.user,dto';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async searchUsers(query: SearchUserDto) {
    const {
      name,
      email,
      role,
      status,
      isOnline,
      skills,
      tags,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      order = 'desc',
    } = query;

    const skip = (page - 1) * limit;

    const orConditions: any[] = [];

    if (name) {
      orConditions.push({ name: { contains: name, mode: 'insensitive' } });
    }

    if (email) {
      orConditions.push({ email: { contains: email, mode: 'insensitive' } });
    }

    if (role) {
      orConditions.push({ role });
    }

    if (status) {
      orConditions.push({ status });
    }

    if (isOnline !== undefined) {
      orConditions.push({ isOnline: isOnline === 'true' });
    }

    if (skills && skills.length > 0) {
      orConditions.push({ skills: { hasSome: skills } });
    }

    if (tags && tags.length > 0) {
      orConditions.push({ tags: { hasSome: tags } });
    }

    const whereCondition = orConditions.length > 0 ? { OR: orConditions } : {};

    return await this.db.prisma.user.findMany({
      where: whereCondition,
      orderBy: {
        [sortBy]: order.trim(),
      },
      skip,
      take: limit,
    });
  }

  async searchByUsername(query: SearchByUsernameDto) {
    const { username, page = 1, limit = 20 } = query;

    const skip = (page - 1) * limit;
    const searchTerm = username.toLowerCase();

    try {
      const allUsers = await this.db.prisma.user.findMany({
        where: {
          AND: [
            {
              OR: [
                { username: { equals: username, mode: 'insensitive' } },
                { username: { startsWith: username, mode: 'insensitive' } },
                { username: { contains: username, mode: 'insensitive' } },
                { name: { contains: username, mode: 'insensitive' } },
              ],
            },
            { status: 'ACTIVE' },
          ],
        },
        select: {
          id: true,
          email: true,
          name: true,
          username: true,
          avatar: true,
          location: true,
          bio: true,
          role: true,
          status: true,
          isOnline: true,
          lastSeen: true,
          joinDate: true,
          connections: true,
          skills: true,
          tags: true,
          createdAt: true,
        },
      });

      const scoredUsers = allUsers.map((user) => {
        let score = 0;
        const userUsername = (user.username || '').toLowerCase();
        const userName = (user.name || '').toLowerCase();

        if (userUsername === searchTerm) {
          score += 100;
        } else if (userUsername.startsWith(searchTerm)) {
          score += 80;
        } else if (userUsername.includes(searchTerm)) {
          score += 60;
        }

        if (userName.includes(searchTerm)) {
          score += 40;
        }

        if (user.isOnline) {
          score += 20;
        }

        if (user.connections > 10) {
          score += 15;
        } else if (user.connections > 5) {
          score += 10;
        } else if (user.connections > 0) {
          score += 5;
        }

        if (user.skills.length > 0) {
          score += user.skills.length * 2;
        }

        if (user.tags.length > 0) {
          score += user.tags.length;
        }

        if (user.avatar) {
          score += 5;
        }

        if (user.bio) {
          score += 3;
        }

        return { ...user, _score: score };
      });

      scoredUsers.sort((a, b) => {
        if (b._score !== a._score) {
          return b._score - a._score;
        }
        if (a.isOnline !== b.isOnline) {
          return b.isOnline ? 1 : -1;
        }
        return b.connections - a.connections;
      });

      const paginatedUsers = scoredUsers.slice(skip, skip + limit);
      const totalCount = scoredUsers.length;

      const finalUsers = paginatedUsers.map(({ _score, ...user }) => user);

      return {
        success: true,
        message: `"${username}" bo'yicha ${totalCount} ta foydalanuvchi topildi`,
        data: {
          users: finalUsers,
          pagination: {
            page,
            limit,
            total: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            hasNext: page * limit < totalCount,
            hasPrev: page > 1,
          },
          searchTerm: username,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Qidirishda xatolik yuz berdi',
        error: error.message,
      };
    }
  }

  async getAllUsers() {
    const users = await this.db.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        bio: true,
        tags: true,
        role: true,
        email: true,
        avatar: true,
        skills: true,
        status: true,
        location: true,
        isOnline: true,
        lastSeen: true,
        joinDate: true,
        createdAt: true,
        updatedAt: true,
        connections: true,
      },
    });

    if (!users) throw new ConflictException('Reference not found');

    return users;
  }

  async getOneUser(id: string, userId: string, userRole: string) {
    const targetUser = await this.db.prisma.user.findUnique({
      where: { id: id },
    });

    if (!targetUser) throw new ConflictException('Reference not found');

    const isSeft = userId === id;

    const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(userRole);

    if (isSeft) {
      const { password, ...rest } = targetUser;
      return rest;
    }

    if (isAdmin) {
      const { password, ...rest } = targetUser;
      return rest;
    }

    return {
      id: targetUser.id,
      name: targetUser.name,
      avatar: targetUser.avatar,
      bio: targetUser.bio,
      skills: targetUser.skills,
      tags: targetUser.tags,
      status: targetUser.status,
      isOnline: targetUser.isOnline,
      lastSeen: targetUser.lastSeen,
      joinDate: targetUser.joinDate,
    };
  }

  async updateUser(
    id: string,
    dto: UpdateUserSelfDto | UpdateUserByAdminDto,
    userId: string,
    userRole: string,
  ) {
    const findUser = await this.db.prisma.user.findUnique({
      where: { id: id },
    });

    if (!findUser) throw new ConflictException('User Id not found');

    const isSelf = userId === id;
    const isAdmin = ['ADMIN', 'SUPERADMIN'].includes(userRole);

    const data: any = {};

    if (isSelf) {
      const selfDto = dto as UpdateUserSelfDto;
      Object.assign(data, {
        name: selfDto.name,
        avatar: selfDto.avatar,
        bio: selfDto.bio,
        location: selfDto.location,
        skills: selfDto.skills,
        tags: selfDto.tags,
      });
    }

    if (isAdmin) {
      const adminDto = dto as UpdateUserByAdminDto;
      Object.assign(data, {
        status: adminDto.status,
      });
    }

    await this.db.prisma.user.update({
      where: { id },
      data,
    });

    return { message: 'Information updated' };
  }

  async updateAvatar(userId: string, avatar: string) {
    return await this.db.prisma.user.update({
      where: { id: userId },
      data: { avatar },
    });
  }
}
