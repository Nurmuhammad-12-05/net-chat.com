import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { VacansyService } from './vacansy.service';
import { CreateVacancyDto } from './dto/create-vacansy.dto';
import { Request } from 'express';
import { BlockGuard } from 'src/common/guard/block.guard';

@Controller('vacansy')
export class VacansyController {
  constructor(private readonly vacansyService: VacansyService) {}

  @Post('create')
  @UseGuards(BlockGuard)
  async createVacansy(
    @Body() createVacansyDto: CreateVacancyDto,
    @Req() req: Request,
  ) {
    const user = req['userId'];

    return await this.vacansyService.createVacansy(createVacansyDto, user);
  }

  @Get('get')
  @SetMetadata('IsPublic', true)
  async GetVacansy() {
    return await this.vacansyService.getvacansy();
  }
}
