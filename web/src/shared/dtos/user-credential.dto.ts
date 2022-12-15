import { PartialType } from '@nestjs/swagger';

export class CreateUserCredentialDto {}

export class UpdateUserCredentialDto extends PartialType(
  CreateUserCredentialDto,
) {}
