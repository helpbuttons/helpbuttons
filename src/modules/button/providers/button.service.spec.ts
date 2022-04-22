import { Test, TestingModule } from '@nestjs/testing';

import { ButtonService } from './button.service';

describe('ButtonService', () => {
  let service: ButtonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ButtonService],
    }).compile();

    service = module.get<ButtonService>(ButtonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
