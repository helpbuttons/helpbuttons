import { Module } from '@nestjs/common'
import { PushNotificationService } from './push-notification.service';
import { PushNotificationController } from './push-notification.controller';
import { UserModule } from '../user/user.module';
import { NetworkModule } from '../network/network.module';

@Module({
  imports: [UserModule, NetworkModule],
  controllers: [PushNotificationController],
  providers: [PushNotificationService],
  exports: [PushNotificationService],
})
export class PushNotifcationModule {}