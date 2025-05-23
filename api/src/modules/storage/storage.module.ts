import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageFile } from './image-file.entity.js';
import { StorageController } from './storage.controller.js';

import { StorageService } from './storage.service.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageFile]),
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
