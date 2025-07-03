import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from 'src/core/database/database.service';
import { GetEventsDto } from './dto/get.events.dto';
import { CreateEventDto } from './dto/create.event.dto';
import { UpdateEventDto } from './dto/update.event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly db: DatabaseService) {}

  async getAllEvents(query: GetEventsDto) {
    const { category, status, organizerId, page = 1, limit = 10 } = query;

    return await this.db.prisma.event.findMany({
      where: {
        ...(category && { category }),
        ...(status && { status }),
        ...(organizerId && { organizerId }),
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        organizer: {
          select: { id: true, name: true, username: true, avatar: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const event = await this.db.prisma.event.findUnique({
      where: { id },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException('Event topilmadi');
    }

    return event;
  }

  async create(createEventDto: CreateEventDto, userId: string) {
    return await this.db.prisma.event.create({
      data: {
        ...createEventDto,
        organizerId: userId,
      },
    });
  }

  async update(id: string, dto: UpdateEventDto) {
    const event = await this.db.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException('Tadbir topilmadi');
    }

    return await this.db.prisma.event.update({
      where: { id },
      data: { ...dto },
    });
  }

  async delete(id: string) {
    const event = await this.db.prisma.event.findUnique({ where: { id } });

    if (!event) {
      throw new NotFoundException('Tadbir topilmadi');
    }

    await this.db.prisma.event.delete({ where: { id } });

    return { message: 'Delete event' };
  }

  async joinEvent(eventId: string, userId: string) {
    const event = await this.db.prisma.event.findUnique({
      where: { id: eventId },
    });
    if (!event) {
      throw new NotFoundException('Tadbir topilmadi');
    }

    const alreadyJoined = await this.db.prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });
    if (alreadyJoined) {
      throw new ConflictException('Siz bu tadbirga allaqachon qo‘shilgansiz');
    }

    await this.db.prisma.eventRegistration.create({
      data: {
        userId,
        eventId,
      },
    });

    await this.db.prisma.event.update({
      where: { id: eventId },
      data: {
        attendees: { increment: 1 },
      },
    });

    return { message: 'Tadbirga muvaffaqiyatli qo‘shildingiz' };
  }

  async leaveEvent(eventId: string, userId: string) {
    const event = await this.db.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Tadbir topilmadi');
    }

    const registration = await this.db.prisma.eventRegistration.findUnique({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    if (!registration) {
      throw new ForbiddenException('Siz bu tadbirda ro‘yxatdan o‘tmagansiz');
    }

    await this.db.prisma.eventRegistration.delete({
      where: {
        userId_eventId: { userId, eventId },
      },
    });

    await this.db.prisma.event.update({
      where: { id: eventId },
      data: {
        attendees: { decrement: 1 },
      },
    });

    return { message: 'Tadbirdan muvaffaqiyatli chiqdingiz' };
  }
}
