import { Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class ErrorLoggerService {
  constructor(private db: DatabaseService) {}

  async logError(
    error: any,
    req?: Request,
    meta?: {
      module?: string;
      controller?: string;
      service?: string;
    },
  ) {
    const message = error?.message || 'Unknown error';
    const errorType = error?.name || 'Error';
    const stack = error?.stack;
    const route = req?.originalUrl;
    const method = req?.method;

    try {
      await this.db.prisma.errorLog.create({
        data: {
          message,
          errorType,
          stack,
          route,
          method,
          module: meta?.module,
          controller: meta?.controller,
          service: meta?.service,
        },
      });
    } catch (logErr) {
      Logger.error('❌ Failed to write error log', logErr);
    }
  }
}
