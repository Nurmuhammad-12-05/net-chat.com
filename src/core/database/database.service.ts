import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { UserRole, UserStatus } from '@prisma/client';
import bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  public readonly prisma: PrismaClient;
  private readonly logger: Logger;

  constructor() {
    this.prisma = new PrismaClient().$extends({
      result: {
        user: {
          imageUrl: {
            needs: {
              avatar: true,
            },
            compute(userFiles) {
              if (!userFiles.avatar) return null;

              const url = process.env.AWS_CLOUDFRONT_URL;

              const imageUrl = `${url}/${userFiles.avatar}`;

              return imageUrl;
            },
          },
        },
      },
    }) as unknown as PrismaClient;

    this.logger = new Logger(DatabaseService.name);
  }

  async onModuleInit() {
    try {
      await this.prisma.$connect();
      const users = [
        {
          id: 'user-001',
          email: 'peter.parker@example.com',
          name: 'Peter Parker',
          username: 'spiderman',
          avatar: 'https://example.com/avatars/spiderman.jpg',
          location: 'New York, USA',
          bio: 'Friendly neighborhood Spider-Man. Web developer by day, superhero by night.',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          isOnline: true,
          lastSeen: new Date(),
          joinDate: new Date('2023-01-15'),
          connections: 245,
          skills: ['JavaScript', 'React', 'Node.js', 'Web Development'],
          tags: ['superhero', 'photography', 'science'],
        },
        {
          id: 'user-002',
          email: 'imam.bukhari@example.com',
          name: 'Imam Bukhari',
          username: 'imam_bukhari',
          avatar: 'https://example.com/avatars/imam.jpg',
          location: 'Bukhara, Uzbekistan',
          bio: 'Islamic scholar and educator. Dedicated to spreading knowledge and wisdom.',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          isOnline: false,
          lastSeen: new Date(Date.now() - 3600000),
          joinDate: new Date('2022-03-10'),
          connections: 189,
          skills: ['Islamic Studies', 'Arabic', 'Teaching', 'Research'],
          tags: ['scholar', 'education', 'religion', 'history'],
        },
        {
          id: 'user-003',
          email: 'muslim.brother@example.com',
          name: 'Ahmad Ali',
          username: 'ahmad_ali',
          avatar: 'https://example.com/avatars/muslim_man.jpg',
          location: 'Istanbul, Turkey',
          bio: 'Software engineer and devout Muslim. Building bridges between technology and faith.',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          isOnline: true,
          lastSeen: new Date(),
          joinDate: new Date('2023-06-20'),
          connections: 156,
          skills: ['Python', 'Django', 'Machine Learning', 'Data Science'],
          tags: ['muslim', 'technology', 'programming', 'community'],
        },
        {
          id: 'user-004',
          email: 'elder.wisdom@example.com',
          name: 'Hassan Karimov',
          username: 'elder_hassan',
          avatar: 'https://example.com/avatars/elder_man.jpg',
          location: 'Samarkand, Uzbekistan',
          bio: 'Retired teacher and community elder. Sharing life experiences and wisdom.',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          isOnline: false,
          lastSeen: new Date(Date.now() - 7200000),
          joinDate: new Date('2021-11-05'),
          connections: 78,
          skills: ['Teaching', 'Literature', 'History', 'Mentoring'],
          tags: ['elder', 'wisdom', 'education', 'community'],
        },
        {
          id: 'user-005',
          email: 'athlete.champion@example.com',
          name: 'Sarah Johnson',
          username: 'champion_sarah',
          avatar: 'https://example.com/avatars/athlete_woman.jpg',
          location: 'Los Angeles, USA',
          bio: 'Olympic athlete and fitness coach. Inspiring others to achieve their athletic goals.',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          isOnline: true,
          lastSeen: new Date(),
          joinDate: new Date('2023-02-28'),
          connections: 312,
          skills: ['Athletics', 'Coaching', 'Nutrition', 'Fitness Training'],
          tags: ['athlete', 'olympics', 'fitness', 'motivation'],
        },
        {
          id: 'user-006',
          email: 'tony.stark@example.com',
          name: 'Tony Stark',
          username: 'iron_man',
          avatar: 'https://example.com/avatars/ironman.jpg',
          location: 'Malibu, California',
          bio: 'Genius, billionaire, playboy, philanthropist. CEO of Stark Industries.',
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
          isOnline: false,
          lastSeen: new Date(Date.now() - 1800000),
          joinDate: new Date('2020-05-15'),
          connections: 1247,
          skills: ['Engineering', 'AI', 'Robotics', 'Business', 'Innovation'],
          tags: ['genius', 'technology', 'business', 'innovation'],
        },
        {
          id: 'user-007',
          email: 'child.prodigy@example.com',
          name: 'Alex Chen',
          username: 'young_genius',
          avatar: 'https://example.com/avatars/smart_kid.jpg',
          location: 'Singapore',
          bio: '12-year-old programming prodigy. Learning and creating amazing things every day!',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          isOnline: true,
          lastSeen: new Date(),
          joinDate: new Date('2024-01-10'),
          connections: 89,
          skills: ['Python', 'Scratch', 'Mathematics', 'Game Development'],
          tags: ['prodigy', 'young', 'programming', 'learning'],
        },
        {
          id: 'user-008',
          email: 'runner.enthusiast@example.com',
          name: 'Bekzod Umarov',
          username: 'runner_bekzod',
          avatar: 'https://example.com/avatars/runner.jpg',
          location: 'Tashkent, Uzbekistan',
          bio: 'Marathon runner and fitness enthusiast. Running towards a healthier lifestyle!',
          role: UserRole.USER,
          status: UserStatus.ACTIVE,
          isOnline: false,
          lastSeen: new Date(Date.now() - 5400000),
          joinDate: new Date('2022-08-12'),
          connections: 167,
          skills: ['Running', 'Marathon Training', 'Nutrition', 'Fitness'],
          tags: ['runner', 'marathon', 'fitness', 'health'],
        },
        {
          id: 'user-009',
          email: 'team.leader@example.com',
          name: 'Michael Rodriguez',
          username: 'team_mike',
          avatar: 'https://example.com/avatars/team_icon.jpg',
          location: 'Mexico City, Mexico',
          bio: 'Team leader and project manager. Building great teams and delivering successful projects.',
          role: UserRole.ADMIN,
          status: UserStatus.ACTIVE,
          isOnline: true,
          lastSeen: new Date(),
          joinDate: new Date('2021-09-30'),
          connections: 234,
          skills: [
            'Project Management',
            'Team Leadership',
            'Agile',
            'Communication',
          ],
          tags: ['leadership', 'teamwork', 'management', 'agile'],
        },
        {
          id: 'user-010',
          email: 'inactive.user@example.com',
          name: 'Jane Smith',
          username: 'jane_inactive',
          avatar: 'https://example.com/avatars/default.jpg',
          location: 'London, UK',
          bio: 'Former active user. Currently taking a break from social media.',
          role: UserRole.USER,
          status: UserStatus.INACTIVE,
          isOnline: false,
          lastSeen: new Date(Date.now() - 2592000000),
          joinDate: new Date('2020-12-01'),
          connections: 45,
          skills: ['Marketing', 'Social Media', 'Content Creation'],
          tags: ['inactive', 'marketing', 'social-media'],
        },
      ];

      for (const user of users) {
        const exists = await this.prisma.user.findUnique({
          where: { id: user.id },
        });

        if (!exists) {
          const hashedPassword = await bcrypt.hash('password123', 10);

          await this.prisma.user.create({
            data: {
              ...user,
              password: hashedPassword,
            },
          });
        } else {
        }
      }
      this.logger.log('Database connected');
    } catch (error) {
      this.logger.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.prisma.$disconnect();
    } catch (error) {
      this.logger.error(error);
      process.exit(1);
    }
  }
}
