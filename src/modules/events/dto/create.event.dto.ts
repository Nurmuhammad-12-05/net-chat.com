import {
  IsString,
  IsNotEmpty,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';

import { EventCategory, EventStatus } from '@prisma/client';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  date: string;

  @IsString()
  time: string;

  @IsString()
  location: string;

  @IsEnum(EventCategory)
  category: EventCategory;

  @IsOptional()
  @IsEnum(EventStatus)
  status?: EventStatus = EventStatus.ACTIVE;

  @IsString()
  organizerId: string;
}
