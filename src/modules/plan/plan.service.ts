import { Injectable } from '@nestjs/common';
import { updatePlan } from './dto/updatePlans.dto';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class PlanService {
    constructor(private db: DatabaseService) { }

    async getAll() {
        return await this.db.prisma.plan.findMany()
    }

    async getOne(id: any) {
        return await this.db.prisma.plan.findUnique({
            where: { id: id }
        })
    }

    async createPlan(planDto: any) {
        return await this.db.prisma.plan.create({ data: planDto })
    }

    async updatePlan(updatePlan: any, id: any) {
        return await this.db.prisma.plan.update({
            where: {
                id: id
            },
            data: updatePlan
        })
    }
}
