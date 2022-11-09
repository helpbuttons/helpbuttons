import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageFile } from './image-file.entity';
import { StorageController } from './storage.controller';

import { StorageService } from './storage.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ImageFile]),
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
