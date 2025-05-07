import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButtonsSeeder } from './buttons.seed.js';
import { Button } from '@src/modules/button/button.entity.js';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from '@src/app/configs/orm.config.js';
import webAppConfig from '@src/app/configs/web-app.config.js';
import { validate } from '@src/app/validators/env.validator.js';
import { User } from '@src/modules/user/user.entity.js';
import { Post } from '@src/modules/post/post.entity.js';
import { Network } from '@src/modules/network/network.entity.js';


seeder({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      encoding: 'utf-8',
      envFilePath: ['.env', '.postgres.env'],
      isGlobal: true,
      load: [webAppConfig],
      validate: validate,
    }),

    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([Button, User, Post, Network]),
  ],
}).run([ButtonsSeeder]);