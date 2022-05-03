import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NetworkService } from './network.service';
import { NetworkController } from './network.controller';
import { Network } from './network.entity';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Network]),
    TagModule
  ],
  controllers: [
    NetworkController
  ],
  providers: [
    NetworkService
  ],
})
export class NetworkModule {}
