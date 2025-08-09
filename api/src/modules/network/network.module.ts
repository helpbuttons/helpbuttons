import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NetworkService } from './network.service.js';
import { NetworkController } from './network.controller.js';
import { Network } from './network.entity.js';
import { TagModule } from '../tag/tag.module.js';
import { StorageModule } from '../storage/storage.module.js';
import { UserModule } from '../user/user.module.js';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    TypeOrmModule.forFeature([Network]),
    TagModule,
    StorageModule,
    CacheModule.register(),
    StorageModule,
    forwardRef(() => UserModule)
  ],
  controllers: [
    NetworkController
  ],
  providers: [
    NetworkService,
  ],
  exports: [NetworkService]
})
export class NetworkModule {}
