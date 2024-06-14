import { Module } from '@nestjs/common';
import { DeletemeController } from './deleteme.controller';
import { ButtonModule } from '../button/button.module';
import { PostModule } from '../post/post.module';
import { ActivityModule } from '../activity/activity.module';
import { UserModule } from '../user/user.module';
import { AuthModule } from '../auth/auth.module';
import { DeletemeService } from './deleteme.service';


@Module({
  imports: [ButtonModule, PostModule, ActivityModule, UserModule, AuthModule],
  controllers: [DeletemeController],
  providers: [DeletemeService],
  exports: [DeletemeService],
})
export class DeletemeModule {}
