import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NetworkService } from './network.service';
import { NetworkController } from './network.controller';
import { Network } from './network.entity';
import { TagModule } from '../tag/tag.module';
import { StorageModule } from '../storage/storage.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Network]),
    TagModule,
    StorageModule,
    UserModule
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
