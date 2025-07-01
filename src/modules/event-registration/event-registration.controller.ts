import { Controller } from '@nestjs/common';
import { EventRegistrationService } from './event-registration.service';

@Controller('event-registration')
export class EventRegistrationController {
  constructor(private readonly eventRegistrationService: EventRegistrationService) {}
}
