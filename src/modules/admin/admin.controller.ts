import { Controller, Get, Query, SetMetadata, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RoleGuard } from 'src/common/guard/role.guard';
import { UserRole } from '@prisma/client';

@Controller('/admin')
@UseGuards(RoleGuard)
@SetMetadata('role', ['ADMIN', 'SUPERADMIN'])
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/status')
  async getPlatformStats() {
    return await this.adminService.getStats();
  }

  @Get('/users')
  async getUsers(
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('role') role?: UserRole,
    @Query('status') status?: string,
  ) {
    // GET /api/admin/users
    // GET /api/admin/users?page=2&limit=10
    // GET /api/admin/users?search=aziz&status=ACTIVE
    // GET /api/admin/users?role=COMPANY

    return await this.adminService.getUsers({
      search,
      page,
      limit,
      role,
      status,
    });
  }

  @Get('/events')
  async getAdminEvents(
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
    @Query('category') category?: string,
    @Query('status') status?: string,
  ) {
    // GET /api/admin/events
    // GET /api/admin/events?search=bootcamp
    // GET /api/admin/events?category=TECHNOLOGY&status=ACTIVE
    // GET /api/admin/events?page=2&limit=10

    return await this.adminService.getAdminEvents({
      search,
      page,
      limit,
      category,
      status,
    });
  }

  @Get('/chats')
  async getAdminChats(
    @Query('search') search?: string,
    @Query('type') type?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 20,
  ) {
    // GET /api/admin/chats
    // GET /api/admin/chats?page=2&limit=10
    // GET /api/admin/chats?type=GROUP
    // GET /api/admin/chats?search=aziz

    return await this.adminService.getAdminChats({ search, type, page, limit });
  }
}
