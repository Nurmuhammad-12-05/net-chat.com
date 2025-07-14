import { Controller, Get, SetMetadata } from '@nestjs/common';

@Controller()
@SetMetadata('isPublic', true)
export class AppController {
  @Get()
  hello() {
    return 'hello';
  }
}
