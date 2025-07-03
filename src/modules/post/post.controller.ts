import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Request } from 'express';
import { BlockGuard } from 'src/common/guard/block.guard';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create')
  @UseGuards(BlockGuard)
  async createPost(@Body() createpostDto: CreatePostDto, @Req() req: Request) {
    const user = req['userId'];
    return await this.postService.createPost(user, createpostDto);
  }

  @Get('get')
  async getPost() {
    return await this.postService.getPosts();
  }

  @Get(':id')
  async getPostById(@Param('id') id: string) {
    const post = await this.postService.getPostById(id);
    if (!post) {
      throw new NotFoundException('Post topilmadi');
    }
    return post;
  }
}
