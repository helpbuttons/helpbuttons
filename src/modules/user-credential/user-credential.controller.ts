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

  @Post()
  create(@Body() createUserCredentialDto: CreateUserCredentialDto) {
    return this.userCredentialService.create(createUserCredentialDto);
  }

  @Get()
  findAll() {
    return this.userCredentialService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userCredentialService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserCredentialDto: UpdateUserCredentialDto,
  ) {
    return this.userCredentialService.update(
      +id,
      updateUserCredentialDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userCredentialService.remove(+id);
  }
}
