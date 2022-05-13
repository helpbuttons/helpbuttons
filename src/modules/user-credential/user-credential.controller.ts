import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

import { UserCredentialService } from './user-credential.service';
import {
  CreateUserCredentialDto,
  UpdateUserCredentialDto,
} from './user-credential.dto';

@Controller('user-credential')
export class UserCredentialController {
  constructor(
    private readonly userCredentialService: UserCredentialService,
  ) {}
}
