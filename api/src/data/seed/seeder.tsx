import { seeder } from 'nestjs-seeder';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { ButtonsSeeder } from './buttons.seed';
import { Button } from '@src/modules/button/button.entity';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from '@src/app/configs/orm.config';
import { Network } from '@src/modules/network/network.entity';


seeder({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      encoding: 'utf-8',
      isGlobal: true,
    }),
    // TypeOrmModule.forRootAsync({
    //     imports: [ConfigModule],
    //     useClass: TypeOrmOptionsService,
    //   }),
    TypeOrmModule.forRoot(dataSourceOptions),
    TypeOrmModule.forFeature([Button]),
    TypeOrmModule.forFeature([Network])
  ],
}).run([ButtonsSeeder]);