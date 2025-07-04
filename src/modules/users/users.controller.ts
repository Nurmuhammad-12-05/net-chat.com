import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  SetMetadata,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { Request } from 'express';
import { RoleGuard } from 'src/common/guard/role.guard';
import { SearchUserDto } from './dto/search.user.dto';
import { S3Service } from 'src/core/storage/s3/s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { SearchByUsernameDto } from './dto/search.by.user,dto';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from 'src/core/database/database.service';
import { BlockGuard } from 'src/common/guard/block.guard';

@Controller('/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
    private readonly db: DatabaseService,
  ) {}

  @Get('/search')
  async searchUsers(@Query() query: SearchUserDto) {
    return await this.usersService.searchUsers(query);
  }

  @Get('/username')
  async searchByUsername(@Query() query: SearchByUsernameDto) {
    return await this.usersService.searchByUsername(query);
  }

  @Get('/blocked-users')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['ADMIN', 'SUPERADMIN'])
  async getBlockedUsers() {
    return await this.usersService.getBlockedUsers();
  }

  @Get('/all')
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get('/skill')
  async getSkillUsers(@Query('skills') skills: string[] | string) {
    const users = await this.usersService.getSkillUsers(skills);
    return { users };
  }
  @Get('get-id/:id')
  async getOneUser(@Param('id') id: string, @Req() req: Request) {
    const userId = req['userId'];

    const userRole = req['role'];

    const user = await this.usersService.getOneUser(id, userId, userRole);

    return { user };
  }

  @Put('update')
  @UseGuards(BlockGuard)
  async updateUser(@Body() dto: any, @Req() req: Request) {
    const userId = req['userId'];

    const userRole = req['role'];

    const updateUser = await this.usersService.updateUser(
      dto,
      userId,
      userRole,
    );

    return updateUser;
  }

  @Post('/upload')
  @UseGuards(BlockGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const userId = req['userId'];

    const uploaded = await this.s3Service.uploadFile(file, 'avatars');

    await this.usersService.updateAvatar(userId, uploaded.url);

    return {
      message: 'Avatar uploaded successfully',
      avatar: uploaded.url,
    };
  }

  @Post('create/:id/block')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['ADMIN', 'SUPERADMIN'])
  async blockUser(
    @Param('id') userId: string,
    @Body() dto: { reason: string; unblockAt: Date },
    @Req() req: Request,
  ) {
    const currentAdminId = req['userId'];

    return await this.usersService.blockUser(userId, dto, currentAdminId);
  }

  @Post(':id/unblock')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['ADMIN', 'SUPERADMIN'])
  async unblockUser(@Param('id') userId: string) {
    return await this.usersService.unblockUser(userId);
  }

  @Cron('0 0 * * *')
  async autoUnblockUsers() {
    await this.db.prisma.userBlock.updateMany({
      where: {
        isActive: true,
        unblockAt: { lte: new Date() },
      },
      data: { isActive: false },
    });
  }
}
