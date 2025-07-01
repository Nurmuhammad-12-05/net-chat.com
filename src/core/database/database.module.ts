import { Global, Module } from '@nestjs/common';
import { SeederModule } from './seeders/seeder.module';
import { DatabaseService } from './database.service';

@Global()
@Module({
  imports: [SeederModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
