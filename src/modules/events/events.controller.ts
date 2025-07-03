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
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { GetEventsDto } from './dto/get.events.dto';
import { CreateEventDto } from './dto/create.event.dto';
import { UpdateEventDto } from './dto/update.event.dto';
import { Request } from 'express';
import { BlockGuard } from 'src/common/guard/block.guard';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async getAllEvents(@Query() query: GetEventsDto) {
    return await this.eventsService.getAllEvents(query);
  }

  @Get('get-event-by-id/:id')
  async getEventById(@Param('id') id: string) {
    const event = await this.eventsService.findOne(id);

    return { event };
  }

  @Post('create-events')
  async createEvent(@Body() dto: CreateEventDto, @Req() req: Request) {
    const userId = req['userId'];

    return await this.eventsService.create(dto, userId);
  }

  @Put('update-events/:id')
  async updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return await this.eventsService.update(id, dto);
  }

  @Delete('delete-events/:id')
  async deleteEvent(@Param('id') id: string) {
    return await this.eventsService.delete(id);
  }

  @Post('join/:id')
  @UseGuards(BlockGuard)
  async joinEvent(@Param('id') eventId: string, @Req() req: Request) {
    const userId = req['userId'];
    return await this.eventsService.joinEvent(eventId, userId);
  }

  @Delete('delete/:id/leave')
  @UseGuards(BlockGuard)
  async leaveEvent(@Param('id') eventId: string, @Req() req: Request) {
    const userId = req['userId'];
    return await this.eventsService.leaveEvent(eventId, userId);
  }
}
