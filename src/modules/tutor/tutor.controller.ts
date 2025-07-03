import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { TutorService } from './tutor.service';
import { RoleGuard } from 'src/common/guard/role.guard';
import { BlockGuard } from 'src/common/guard/block.guard';

@Controller('tutor')
export class TutorController {
  constructor(private readonly tutorService: TutorService) {}

  @Put('update/:username')
  @UseGuards(RoleGuard, BlockGuard)
  @SetMetadata('role', ['ADMIN', 'SUPERADMIN', 'TUTOR'])
  async updateUserToTutor(@Param('username') username: string) {
    await this.tutorService.updateUserToTutor(username);
    return { message: 'update user role' };
  }

  @Get('get-all')
  async getAll() {
    return await this.tutorService.getAll();
  }
}
