import { Module } from '@nestjs/common';

import { ButtonService } from './providers/button.service';
import { ButtonController } from './controllers/button.controller';
import { ButtonSerializer } from './providers/button.serializer';
import { ButtonRepository } from './providers/button.repository';
import { PrismaModule } from '@src/shared/modules/prisma-management/prisma-management.module';
import { PrismaService } from '@src/shared/modules/prisma-management/prisma-management.service';

@Module({
  imports: [PrismaModule],
  controllers: [ButtonController],
  providers: [
    ButtonService,
    ButtonSerializer,
    ButtonRepository,
    PrismaService,
  ],
})
export class ButtonModule {}
