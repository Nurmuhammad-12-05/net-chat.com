import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacansy.dto';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class VacansyService {
  constructor(private db: DatabaseService) {}

  async createVacansy(createVacansyDto: CreateVacancyDto, user: string) {
    const findUser = await this.db.prisma.user.findUnique({
      where: {
        id: user,
      },
    });

    const check = findUser?.role !== 'USER';

    if (!findUser && !check) {
      return new NotFoundException('company not found');
    }

    const data = { ...createVacansyDto, companyId: user };

    return await this.db.prisma.vacancy.create({
      data: {
        ...data,
      },
    });
  }

  async getvacansy() {
    return await this.db.prisma.vacancy.findMany({});
  }
}
