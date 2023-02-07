import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { SetupController } from './setup.controller';
import { SetupService } from './setup.service';

@Module({
  imports: [
    TypeOrmModule,
    UserModule
  ],
  controllers: [SetupController],
  providers: [SetupService],
})
export class SetupModule {}
