import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';
import { UpdateUserByAdminDto, UpdateUserSelfDto } from './dto/update.user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

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
}
