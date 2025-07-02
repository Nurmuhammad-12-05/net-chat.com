import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class AdminService {
  constructor(private readonly db: DatabaseService) {}
}
