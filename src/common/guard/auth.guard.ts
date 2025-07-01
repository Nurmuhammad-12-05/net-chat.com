import {
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

    const functionHendler = context.getHandler();

    const isPublic = this.reflector.getAllAndOverride('isPublic', [
      classHendler,
      functionHendler,
    ]);

    const isAdmin = this.reflector.getAllAndOverride('isPublic', [
      classHendler,
      functionHendler,
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
      throw new InternalServerErrorException('Token invalide.!!');
    }
  }
}
