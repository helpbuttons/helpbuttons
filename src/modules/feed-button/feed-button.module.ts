import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedButton } from './feed-button.entity';
import { StorageModule } from '../storage/storage.module';
import { FeedButtonController } from './feed-button.controller';
import { FeedButtonService } from './feed-button.service';
import { ButtonModule } from '../button/button.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([FeedButton]),
    StorageModule,
    ButtonModule,
    UserModule
  ],
  controllers: [
    FeedButtonController
  ],
  providers: [
    FeedButtonService,
  ],
  exports: [FeedButtonService]
})
export class FeedButtonModule {}
