import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButtonsSeeder } from './buttons.seed';
import { Button } from '@src/modules/button/button.entity';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from '@src/app/configs/orm.config';
import webAppConfig from '@src/app/configs/web-app.config';
import { validate } from '@src/app/validators/env.validator';
import { User } from '@src/modules/user/user.entity';
import { Post } from '@src/modules/post/post.entity';
import { Network } from '@src/modules/network/network.entity';


seeder({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      envFilePath: ['.env', '.postgres.env'],
      isGlobal: true,
      load: [webAppConfig],
      validate: validate,
    }),

    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([Button, User, Post, Network]),
  ],
}).run([ButtonsSeeder]);