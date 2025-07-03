import { Body, Controller, Get, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) { }
  
  @Post('create')
  async createPost(@Body() createpostDto: CreatePostDto) {
    try {
      const user = 'c404005d-0f4a-47ac-9029-cdd4011c6938'
      return await this.postService.createPost(user,createpostDto)
    } catch (error) {
      console.log(error);
    }
  }

  @Get('get')
  async getPost() {
    try {
      return await this.postService.getPosts()
    } catch (error) {
      console.log(error);
      
    }
  }
}
