import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { DatabaseService } from 'src/core/database/database.service';

@Injectable()
export class PostService {
 
  constructor(private db: DatabaseService) { }

  async createPost(user: string, createpostDto: CreatePostDto) {
    try {

      const create = await this.db.prisma.post.create({
        data: {
          ...createpostDto,
          authorId: user
        }
      })

      return create
    } catch (error) {
      console.log(error);
    }
  }

  async getPosts() {
    try {
      return await this.db.prisma.post.findMany()
    } catch (error) {
      console.log(error);
      
    }
  }
}
