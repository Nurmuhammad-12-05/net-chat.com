import { Body, Controller, Get, Post, Req, SetMetadata, UseGuards } from '@nestjs/common';
import { VacansyService } from './vacansy.service';
import { CreateVacancyDto } from './dto/create-vacansy.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Request } from 'express';

@Controller('vacansy')
export class VacansyController {
  constructor(private readonly vacansyService: VacansyService) { }

  @Post('create')
  async createVacansy(@Body() createVacansyDto: CreateVacancyDto, @Req() req: Request) {
    try {
      const user = '8001475d-c7e9-441b-88c5-c32360601457'
      return await this.vacansyService.createVacansy(createVacansyDto, user)
    } catch (error) {
      console.log(error);
    }
  }

  @Get('get')
  @SetMetadata('IsPublic', true)
  async GetVacansy() {
    try {
      return await this.vacansyService.getvacansy()
    } catch (error) {
      console.log(error);

    }
  }
}
