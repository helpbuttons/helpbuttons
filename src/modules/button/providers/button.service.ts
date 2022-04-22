import { Injectable } from '@nestjs/common';

import { CreateButtonDto } from '../dto/requests/create-button.dto';
import { UpdateButtonDto } from '../dto/requests/update-button.dto';

@Injectable()
export class ButtonService {
  create(createButtonDto: CreateButtonDto) {
    return 'This action adds a new button';
  }

  findAll() {
    return `This action returns all button`;
  }

  findOne(id: number) {
    return `This action returns a #${id} button`;
  }

  update(id: number, updateButtonDto: UpdateButtonDto) {
    return `This action updates a #${id} button`;
  }

  remove(id: number) {
    return `This action removes a #${id} button`;
  }
}
