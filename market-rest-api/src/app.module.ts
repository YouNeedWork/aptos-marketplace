import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entity/User';
import { Lists } from './entity/Lists';
import { Collection } from './entity/Collection';
import { Token } from './entity/Token';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '!Woaini521',
      database: 'postgres',
      entities: [User, Lists, Collection, Token],
      synchronize: true,
      logging: true,
    }),
    TypeOrmModule.forFeature([User, Lists, Collection, Token]),
  ],
  controllers: [AppController, CatsController],
  providers: [AppService],
})
export class AppModule {}
