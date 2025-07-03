import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVacancyDto } from './dto/create-vacansy.dto';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class VacansyService {
  
  constructor(private db: DatabaseService) { }

  async createVacansy(createVacansyDto: CreateVacancyDto, user: string) {
    try {
      const findUser = await this.db.prisma.user.findUnique({
        where: {
          id: user
        }
      })
      const check = findUser?.role === 'COMPANY'
      if (!findUser && !check) {
        return new NotFoundException('company not found')
      }
      const data = { ...createVacansyDto, companyId: user }
      return await this.db.prisma.vacancy.create({
        data
      })
    } catch (error) {
      console.log(error);
    }
  }

  async getvacansy() {
    try {
      return await this.db.prisma.vacancy.findMany({})
    } catch (error) {
      console.log(error);
      
    }
  }
}
