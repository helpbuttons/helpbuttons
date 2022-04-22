import { Module } from '@nestjs/common';

import { ButtonService } from './providers/button.service';
import { ButtonController } from './controllers/button.controller';

@Module({
  controllers: [ButtonController],
  providers: [ButtonService],
})
export class ButtonModule {}
