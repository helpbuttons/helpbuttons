import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NetworkService } from './network.service';
import { NetworkController } from './network.controller';
import { Network } from './network.entity';
import { TagModule } from '../tag/tag.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Network]),
    TagModule,
    StorageModule
  ],
  controllers: [
    NetworkController
  ],
  providers: [
    NetworkService
  ],
  exports: [NetworkService]
})
export class NetworkModule {}
