import {
  Injectable,
  InternalServerErrorException,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
          email: 'user1@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Ali Hasanov',
          username: 'alihsnv',
          avatar: 'https://cdn.example.com/avatars/user1.jpg',
          location: 'Toshkent, Uzbekistan',
          bio: 'Senior Full-stack developer with 7 years of experience in Node.js, React, and DevOps.',
          role: 'USER',
          connections: 12,
          skills: ['Node.js', 'React', 'PostgreSQL', 'Docker'],
          tags: ['backend', 'mentor', 'freelancer'],
        },
        {
          email: 'user2@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Nodira Karimova',
          username: 'nodira_k',
          avatar: 'https://cdn.example.com/avatars/user2.jpg',
          location: 'Samarqand, Uzbekistan',
          bio: 'Frontend developer specializing in Angular and TailwindCSS.',
          role: 'USER',
          connections: 8,
          skills: ['Angular', 'TailwindCSS', 'TypeScript'],
          tags: ['frontend', 'designer'],
        },
        {
          email: 'user3@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Javlon Qodirov',
          username: 'javlon_q',
          avatar: 'https://cdn.example.com/avatars/user3.jpg',
          location: 'Andijon, Uzbekistan',
          bio: 'React Native developer with mobile-first mindset.',
          role: 'USER',
          connections: 6,
          skills: ['React Native', 'Expo', 'Firebase'],
          tags: ['mobile', 'react'],
        },
        {
          email: 'user4@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Dilnoza Ibrohimova',
          username: 'dilnoza_i',
          avatar: 'https://cdn.example.com/avatars/user4.jpg',
          location: 'Navoiy, Uzbekistan',
          bio: 'UI/UX designer with passion for clean interfaces.',
          role: 'USER',
          connections: 10,
          skills: ['Figma', 'Adobe XD', 'UX Research'],
          tags: ['designer', 'creative'],
        },
        {
          email: 'user5@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Shaxboz Mirzayev',
          username: 'shaxboz_m',
          avatar: 'https://cdn.example.com/avatars/user5.jpg',
          location: 'Namangan, Uzbekistan',
          bio: 'NestJS backend developer focused on scalable APIs.',
          role: 'USER',
          connections: 15,
          skills: ['NestJS', 'TypeScript', 'Prisma', 'PostgreSQL'],
          tags: ['backend', 'nestjs'],
        },
        {
          email: 'user6@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Malika Usmonova',
          username: 'malika_u',
          avatar: 'https://cdn.example.com/avatars/user6.jpg',
          location: 'Farg‘ona, Uzbekistan',
          bio: 'Mobile developer building cross-platform apps.',
          role: 'USER',
          connections: 5,
          skills: ['Flutter', 'Dart', 'Firebase'],
          tags: ['mobile', 'flutter'],
        },
        {
          email: 'user7@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Sherzod Karimov',
          username: 'sherzod_k',
          avatar: 'https://cdn.example.com/avatars/user7.jpg',
          location: 'Jizzax, Uzbekistan',
          bio: 'Backend engineer with C# and .NET experience.',
          role: 'USER',
          connections: 9,
          skills: ['C#', '.NET Core', 'SQL Server'],
          tags: ['backend', 'dotnet'],
        },
        {
          email: 'user8@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Gulnora Asqarova',
          username: 'gulnora_a',
          avatar: 'https://cdn.example.com/avatars/user8.jpg',
          location: 'Buxoro, Uzbekistan',
          bio: 'Python developer focused on data analysis.',
          role: 'USER',
          connections: 11,
          skills: ['Python', 'Pandas', 'NumPy', 'Jupyter'],
          tags: ['data', 'python'],
        },
        {
          email: 'user9@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Kamron Rashidov',
          username: 'kamron_r',
          avatar: 'https://cdn.example.com/avatars/user9.jpg',
          location: 'Xorazm, Uzbekistan',
          bio: 'DevOps enthusiast with AWS and Docker experience.',
          role: 'USER',
          connections: 7,
          skills: ['AWS', 'Docker', 'CI/CD'],
          tags: ['devops', 'cloud'],
        },
        {
          email: 'user10@example.com',
          password: await bcrypt.hash('password123', 10),
          name: 'Zarnigor Yusupova',
          username: 'zarnigor_y',
          avatar: 'https://cdn.example.com/avatars/user10.jpg',
          location: 'Qarshi, Uzbekistan',
          bio: 'Golang developer building microservices.',
          role: 'USER',
          connections: 4,
          skills: ['Go', 'gRPC', 'Kubernetes'],
          tags: ['golang', 'backend'],
        },
      ];

      for (const user of users) {
        await this.prisma.user.upsert({
          where: { email: user.email },
          update: {},
          create: {
            ...user,
            role: 'USER',
          },
        });
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
