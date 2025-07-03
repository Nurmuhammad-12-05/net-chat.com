import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

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

    const authHeader = request.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new BadRequestException(
        'Authorization header missing or malformed',
      );
    }

    const token = authHeader.split(' ')[1];

    try {
      const { userId, role } = await this.jwtService.verifyAsync(token);

      request.userId = userId;
      request.role = role;

      return true;
    } catch (error) {
      throw new BadRequestException('Token is invalid!');
    }
  }
}
