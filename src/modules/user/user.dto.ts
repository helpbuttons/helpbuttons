import { PartialType } from '@nestjs/swagger';

export class CreateUserDto {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
