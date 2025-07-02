import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly db: DatabaseService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    const userId = request.userId;

    const userRole = request.role;

    const classHandler = context.getClass();

    const functionHandler = context.getHandler();

    const role = this.reflector.getAllAndOverride('role', [
      classHandler,
      functionHandler,
    ]);

    if (!role.includes(userRole)) {
      throw new BadRequestException('Role invalide.!!');
    }

    return true;
  }
}
