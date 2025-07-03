import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class TutorService {

  constructor(private db: DatabaseService) { }

  async updateUserToTutor(username: string) {
    try {
      const updateUserToTutor = await this.db.prisma.user.update({
        where: {
          username
        },
        data: {
          role: 'TUTOR'
        }
      })
      return updateUserToTutor
    } catch (error) {
      console.log(error);

    }
  }

  async getAll() {
    try {
      return await this.db.prisma.user.findMany({
        where: {
          role: 'TUTOR'
        }
      })
    } catch (error) {
      console.log(error);
    }
  }
}
