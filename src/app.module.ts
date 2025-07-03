import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { ChatModule } from './modules/chat/chat.module';
import { MessageModule } from './modules/message/message.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './common/guard/auth.guard';
import { AdminModule } from './modules/admin/admin.module';
import TransformIntersector from './common/intersector/transform.intersector.service';
import { PlanModule } from './modules/plan/plan.module';
import { PostModule } from './modules/post/post.module';
import { TutorModule } from './modules/tutor/tutor.module';
import { VacansyModule } from './modules/vacansy/vacansy.module';
import { ErrorLoggerService } from './common/services/error-logger.service';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UsersModule,
    EventsModule,
    ChatModule,
    MessageModule,
    AdminModule,
    PlanModule,
    PostModule,
    TutorModule,
    VacansyModule,
  ],
  providers: [
    ErrorLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformIntersector,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  exports: [ErrorLoggerService],
})
export class AppModule {}
