import { Body, Controller, Get, Param, Post, Put, SetMetadata, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { updatePlan } from './dto/updatePlans.dto';
import { PlanDto } from './dto/create.dto';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) { }

  @Get('/plans')
  async getAllPlans() {
    return await this.planService.getAll()
  }

  @Post('/plans/new')
  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  async addNewPlans(@Body() createPlanDto: PlanDto) {
    return await this.planService.createPlan(createPlanDto)
  }

  @Put('plans/:id') 
  @UseGuards(RoleGuard)
  @SetMetadata('roles', ['admin', 'superadmin'])
  async updatePlan(@Body() updatePlan: updatePlan, @Param('id') id: string) {
    return await this.planService.updatePlan(updatePlan,id)
  }

  @Get('/:id')
  async getOnePlan(@Param('id') id: string) {
    return await this.planService.getOne( id)
  }

}
