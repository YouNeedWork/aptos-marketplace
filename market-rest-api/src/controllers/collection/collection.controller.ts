import { Controller, Get } from '@nestjs/common';
import { Collection } from 'src/entity/Collection';

@Controller('collections')
export class CollectionController {
  constructor() {}

  @Get()
  list(): Collection[] {
    return [];
  }
}
