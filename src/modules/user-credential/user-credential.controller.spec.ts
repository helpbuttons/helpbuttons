import { Test, TestingModule } from '@nestjs/testing';
import { UserCredentialController } from './user-credential.controller';
import { UserCredentialService } from './user-credential.service';

describe('UserCredentialController', () => {
  let controller: UserCredentialController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserCredentialController],
      providers: [UserCredentialService],
    }).compile();

    controller = module.get<UserCredentialController>(UserCredentialController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
