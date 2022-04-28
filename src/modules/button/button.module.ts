import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButtonService } from './providers/button.service';
import { ButtonController } from './controllers/button.controller';
import { ButtonSerializer } from './providers/button.serializer';
import { ButtonRepository } from './providers/button.repository';
import { PrismaModule } from '@src/shared/modules/prisma-management/prisma-management.module';
import { PrismaService } from '@src/shared/modules/prisma-management/prisma-management.service';
import { ButtonOrm } from './providers/typeorm/buttonOrm.entity';
import { ButtonOrmService } from './providers/typeorm/buttonOrm.service';
import { ButtonOrmController } from './controllers/buttonOrm.controller';


@Module({
  imports: [
    PrismaModule,
    TypeOrmModule.forFeature([ButtonOrm]),
  ],
  controllers: [
    ButtonOrmController,
    ButtonController
  ],
  providers: [
    ButtonService,
    ButtonSerializer,
    ButtonRepository,
    ButtonOrmService,
    PrismaService,
  ],
})
export class ButtonModule {}
