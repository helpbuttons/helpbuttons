import { Module } from '@nestjs/common';
import configs from '@src/config/configuration.js';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { UserCredentialModule } from '../user-credential/user-credential.module.js';
import { UserModule } from '../user/user.module.js';
import { MailModule } from '../mail/mail.module.js';
import { TagModule } from '../tag/tag.module.js';
import { LocalStrategy } from './strategies/local.strategy.js';
import { JwtStrategy } from './strategies/jwt.strategy.js';
import { StorageModule } from '../storage/storage.module.js';
import { NetworkModule } from '../network/network.module.js';
import { InviteModule } from '../invite/invite.module.js';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configs().jwtSecret,
      signOptions: {expiresIn: '60s'}
    }),
    UserCredentialModule,
    UserModule,
    MailModule,
    StorageModule,
    TagModule,
    NetworkModule,
    InviteModule
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy],
})
export class AuthModule {}
