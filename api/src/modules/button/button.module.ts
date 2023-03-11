import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButtonService } from './button.service';
import { ButtonController } from './button.controller';
import { Button } from './button.entity';
import { TagModule } from '../tag/tag.module';
import { NetworkModule } from '../network/network.module';
import { StorageModule } from '../storage/storage.module';
import { PostModule } from '../post/post.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Button]),
    TagModule,
    NetworkModule,
    StorageModule,
    forwardRef(() => PostModule)
  ],
  controllers: [
    ButtonController
  ],
  providers: [
    ButtonService
  ],
  exports: [
    ButtonService
  ]
})
export class ButtonModule {}
