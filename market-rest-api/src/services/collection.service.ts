import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Collection } from '../entity/Collection';

@Injectable()
export class CollectionService {
  constructor(
    @InjectRepository(Collection)
    private collection: Repository<Collection>,
  ) {}

  findNew(count: number): Promise<Collection[]> {
    return this.collection.find({
      order: {
        id: 'DESC',
      },
    });
  }

  findAll(): Promise<Collection[]> {
    return this.collection.find();
  }

  findByHash(hash: String): Promise<Collection[]> {
    return this.collection.find();
  }

  findOne(id: number): Promise<Collection> {
    return this.collection.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.collection.delete(id);
  }
}
