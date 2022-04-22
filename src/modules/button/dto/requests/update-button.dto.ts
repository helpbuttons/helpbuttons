import { PartialType } from '@nestjs/swagger';

import { CreateButtonDto } from './create-button.dto';

export class UpdateButtonDto extends PartialType(CreateButtonDto) {}
