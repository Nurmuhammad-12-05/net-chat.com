import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class TutorService {
  constructor(private db: DatabaseService) {}

  async updateUserToTutor(username: string) {
    const findUsername = await this.db.prisma.user.findUnique({
      where: { username: username },
    });

    if (!findUsername) throw new ConflictException('username not found');

    const updateUserToTutor = await this.db.prisma.user.update({
      where: {
        username,
      },
      data: {
        role: 'TUTOR',
      },
    });
    return updateUserToTutor;
  }

  async getAll() {
    return await this.db.prisma.user.findMany({
      where: {
        role: 'TUTOR',
      },
      select: {
        id: true,
        avatar: true,
        name: true,
        username: true,
        bio: true,
        skills: true,
        tags: true,
      },
    });
  }
}
