import { Controller, Get, Param, Put, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) { }
  
  @Put('update')
  @UseGuards(RoleGuard)
  @SetMetadata('role',['ADMIN','SUPERADMIN'])
  async updateUserToTutor(@Param('username') username:string) {
    try {
      await this.tutorService.updateUserToTutor(username)
      return true
    } catch (error) {
      console.log(error);
      
    }
  }

  @Get('get-all')
  async getAll() {
    try {
      return await this.tutorService.getAll()
    } catch (error) {
      console.log(error);
    }
  }
}
