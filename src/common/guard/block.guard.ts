import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class BlockGuard implements CanActivate {
  constructor(private readonly db: DatabaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const userId = req.user?.id;

    const block = await this.db.prisma.userBlock.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });

    if (block) {
      return req.method === 'GET';
    }

    return true;
  }
}
