import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { User } from './entity/User';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private user: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.user.find();
  }

  findOne(id: number): Promise<User> {
    return this.user.findOneBy({ id });
  }

  async remove(id: string): Promise<void> {
    await this.user.delete(id);
  }

  getHello(): string {
    return 'Hello World!';
  }
}
