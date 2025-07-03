import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { token } = request.cookies;

    const classHendler = context.getClass();

    const classHandler = context.getClass();

    const functionHandler = context.getHandler();

    const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
      functionHandler,
      classHandler,
    ]);

    const isAdmin = this.reflector.getAllAndOverride<boolean>('isAdmin', [
      functionHandler,
      classHandler,
    ]);

    if (isPublic && !isAdmin) return true;

    try {
      if (isAdmin) {
        const { userId, role } = await this.jwtService.verifyAsync(token);

        request.userId = userId;

        request.role = role;

        return true;
      } else {
        const { userId, role } = await this.jwtService.verifyAsync(token);

        request.userId = userId;

        request.role = role;

        return true;
      }
    } catch (error) {
      throw new BadRequestException('Token invalide.!!');
    }
  }
}
