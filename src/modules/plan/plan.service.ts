import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';
import { of } from 'rxjs';
import { UpdatePlanDto } from './dto/updatePlans.dto';
import { PlanDto } from './dto/create.dto';

@Injectable()
export class PlanService {
  constructor(private db: DatabaseService) {}

  async getAll() {
    return await this.db.prisma.plan.findMany();
  }

  async createPlan(planDto: PlanDto) {
    return await this.db.prisma.plan.create({ data: planDto });
  }

  async updatePlan(updatePlan: UpdatePlanDto, id: string) {
    const findPlanId = await this.db.prisma.plan.findUnique({
      where: { id: id },
    });

    if (!findPlanId) throw new ConflictException('Plan id not found');

    await this.db.prisma.plan.update({
      where: {
        id: id,
      },
      data: updatePlan,
    });

    return { message: 'Update plan' };
  }

  async getOne(id: string) {
    return await this.db.prisma.plan.findUnique({
      where: { id: id },
    });
  }
}
