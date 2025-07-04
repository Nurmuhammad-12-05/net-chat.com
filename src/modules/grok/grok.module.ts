import { Module } from '@nestjs/common';

import { GroqService } from './grok.service';
import { GroqController } from './grok.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [GroqController],
  providers: [GroqService],
})
export class GroqModule {}
