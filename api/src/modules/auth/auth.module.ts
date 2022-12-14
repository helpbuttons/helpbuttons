import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserCredentialModule } from '../user-credential/user-credential.module';
import { UserModule } from '../user/user.module';
import { MailModule } from '../mail/mail.module';
import { TagModule } from '../tag/tag.module';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
var configFile = require('../../../config.json');

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: configFile.jwtSecret,
      signOptions: {expiresIn: '60s'}
    }),
    UserCredentialModule,
    UserModule,
    MailModule,
    TagModule],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy],
})
export class AuthModule {}
