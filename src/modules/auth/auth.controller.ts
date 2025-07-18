import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateRegisterDto } from './dto/create.register.dto';
import { Request, Response } from 'express';
import { CreateLoginDto } from './dto/create.login.dto';
import { RoleGuard } from 'src/common/guard/role.guard';
import { UpdateUserRoleDto } from './dto/update.user.role.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @SetMetadata('isPublic', true)
  async register(@Body() createRegisterDto: CreateRegisterDto) {
    const access_token = await this.authService.register(createRegisterDto);

    return {
      message: 'The failure was registered in the system.',
      access_token,
    };
  }

  @Post('/login')
  @SetMetadata('isPublic', true)
  async login(@Body() createLoginDto: CreateLoginDto) {
    const access_token = await this.authService.login(createLoginDto);

    return { message: 'The system has been logged in.', access_token };
  }

  @Post('/logout')
  async logout() {
    return { message: 'Logged out successfully' };
  }

  @Get('/me')
  async me(@Req() req: Request) {
    const userId = req['userId'];

    const user = await this.authService.me(userId);

    return { user };
  }

  @Put('/add-admin/:id')
  @UseGuards(RoleGuard)
  @SetMetadata('isPublic', true)
  @SetMetadata('role', ['SUPERADMIN'])
  @SetMetadata('isAdmin', true)
  async updateUserRole(
    @Body() updateUserRoleDto: UpdateUserRoleDto,
    @Param('id') id: string,
  ) {
    return await this.authService.updateUserRole(updateUserRoleDto, id);
  }
}
