import { Module } from '@nestjs/common';
import { DeletemeController } from './deleteme.controller.js';
import { ButtonModule } from '../button/button.module.js';
import { PostModule } from '../post/post.module.js';
import { ActivityModule } from '../activity/activity.module.js';
import { UserModule } from '../user/user.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { DeletemeService } from './deleteme.service.js';


@Module({
  imports: [ButtonModule, PostModule, ActivityModule, UserModule, AuthModule],
  controllers: [DeletemeController],
  providers: [DeletemeService],
  exports: [DeletemeService],
})
export class DeletemeModule {}
