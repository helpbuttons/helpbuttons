import { Test, TestingModule } from '@nestjs/testing';

import { ButtonController } from './button.controller';
import { ButtonService } from '../providers/button.service';

describe('ButtonController', () => {
  let controller: ButtonController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ButtonController],
      providers: [ButtonService],
    }).compile();

    controller = module.get<ButtonController>(ButtonController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
