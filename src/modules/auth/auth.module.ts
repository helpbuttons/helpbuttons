import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserCredentialModule } from '../user-credential/user-credential.module';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { TagModule } from '../tag/tag.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserCredentialModule,
    UserModule,
    MailModule,
    TagModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
