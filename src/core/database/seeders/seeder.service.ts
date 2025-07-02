import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database.service';
import bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger: Logger;

  constructor(
    private readonly configService: ConfigService,
    private readonly db: DatabaseService,
  ) {
    this.logger = new Logger(SeederService.name);
  }

  async onModuleInit() {
    const email = this.configService.get('SUPERADMIN_EMAIL') as string;

    const password = this.configService.get('SUPERADMIN_PASSWORD') as string;

    const findEmail = await this.db.prisma.user.findUnique({
      where: { email: email },
    });

    const hashPassword = await bcrypt.hash(password, 12);

    if (!findEmail) {
      await this.db.prisma.user.create({
        data: {
          name: 'Bobur',
          email: email,
          password: hashPassword,
          role: 'SUPERADMIN',
        },
      });
    }

    this.logger.log('Seeder added');
  }
}
