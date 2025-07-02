import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { GetEventsDto } from './dto/get.events.dto';
import { CreateEventDto } from './dto/create.event.dto';
import { UpdateEventDto } from './dto/update.event.dto';
import { Request } from 'express';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getAllEvents(@Query() query: GetEventsDto) {
    return await this.eventsService.getAllEvents(query);
  }

  @Get('/:id')
  async getEventById(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);

    return { event };
  }

  @Post()
  async createEvent(@Body() dto: CreateEventDto) {
    return await this.eventsService.create(dto);
  }

  @Put('/:id')
  async updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return await this.eventsService.update(id, dto);
  }

  @Delete('/:id')
  async deleteEvent(@Param('id') id: string) {
    return await this.eventsService.delete(id);
  }

  @Post(':id/join')
  async joinEvent(@Param('id') eventId: string, @Req() req: Request) {
    const userId = req['userId'];
    return await this.eventsService.joinEvent(eventId, userId);
  }

  @Delete(':id/leave')
  async leaveEvent(@Param('id') eventId: string, @Req() req: Request) {
    const userId = req['userId'];
    return await this.eventsService.leaveEvent(eventId, userId);
  }
}
