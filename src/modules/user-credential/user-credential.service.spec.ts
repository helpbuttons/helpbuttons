import { Test, TestingModule } from '@nestjs/testing';
import { UserCredentialService } from './user-credential.service';

describe('UserCredentialService', () => {
  let service: UserCredentialService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserCredentialService],
    }).compile();

    service = module.get<UserCredentialService>(UserCredentialService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
