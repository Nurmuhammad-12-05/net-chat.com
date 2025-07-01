import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { EventsModule } from './modules/events/events.module';
import { EventRegistrationModule } from './modules/event-registration/event-registration.module';
import { ChatModule } from './modules/chat/chat.module';
import { ChatParticipantModule } from './modules/chat-participant/chat-participant.module';
import { MessageModule } from './modules/message/message.module';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthGuard } from './common/guard/auth.guard';
import TransformIntersector from './common/intersector/transform.intersector.service';

@Module({
  imports: [
    CoreModule,
    AuthModule,
    UsersModule,
    EventsModule,
    EventRegistrationModule,
    ChatModule,
    ChatParticipantModule,
    MessageModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformIntersector,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
