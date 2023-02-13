import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppService } from './app.service';
import { CatsController } from './cats.controller';
import { User } from './entity/User';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [AppService],
  controllers: [CatsController],
})
export class UsersModule {}
