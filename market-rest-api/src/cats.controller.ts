import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './entity/User';

@Controller('cats')
export class CatsController {
  constructor(private readonly appService: AppService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.appService.findAll();
  }
}
