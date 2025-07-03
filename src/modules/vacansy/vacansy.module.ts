import { Module } from '@nestjs/common';
import { VacansyService } from './vacansy.service';
import { VacansyController } from './vacansy.controller';

@Module({
  controllers: [VacansyController],
  providers: [VacansyService],
})
export class VacansyModule {}
