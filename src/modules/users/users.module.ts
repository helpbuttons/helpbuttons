import { Module } from '@nestjs/common';

import { UsersService } from './providers/users.service';
import { UsersController } from './controllers/users.controller';
import { UsersRepository } from './providers/users.repository';
import { UsersSerializer } from './providers/users.serializer';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, UsersSerializer],
})
export class UsersModule {}
