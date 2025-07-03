import { ConflictException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class PostService {
  constructor(private db: DatabaseService) {}

  async createPost(user: string, createpostDto: CreatePostDto) {
    const findUserId = await this.db.prisma.user.findUnique({
      where: { id: user },
    });

    if (!findUserId) throw new ConflictException('User id not found');

    const create = await this.db.prisma.post.create({
      data: {
        ...createpostDto,
        authorId: user,
      },
    });

    return create;
  }

  async getPosts() {
    return await this.db.prisma.post.findMany();
  }

  async getPostById(id: string) {
    return this.db.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
      },
    });
  }
}
