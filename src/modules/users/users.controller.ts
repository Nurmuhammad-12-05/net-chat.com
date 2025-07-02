import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['SUPERADMIN', 'ADMIN'])
  async getAllUsers() {
    const users = await this.usersService.getAllUsers();

    return { users };
  }

  @Get('/:id')
  async getOneUser(@Param('id') id: string, @Req() req: Request) {
    const userId = req['userId'];

    const userRole = req['role'];

    const user = await this.usersService.getOneUser(id, userId, userRole);

    return { user };
  }

  @Put('/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: any,
    @Req() req: Request,
  ) {
    const userId = req['userId'];

    const userRole = req['role'];

    const updateUser = await this.usersService.updateUser(
      id,
      dto,
      userId,
      userRole,
    );

    return updateUser;
  }
}
