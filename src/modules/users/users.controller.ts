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

@Controller('/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly s3Service: S3Service,
  ) {}

  @Get('/search')
  async searchUsers(@Query() query: SearchUserDto) {
    return this.usersService.searchUsers(query);
  }

  @Get('/username')
  async searchByUsername(@Query() query: SearchByUsernameDto) {
    return this.usersService.searchByUsername(query);
  }

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

  @Post('/upload')
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
}
