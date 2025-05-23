import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { uuid } from '@src/shared/helpers/uuid.helper.js';
import { Repository } from 'typeorm';
import { CreateTemplateButtonDto,UpdateTemplateButtonDto } from './template-button.dto.js';
import { TemplateButton } from './template-button.entity.js';

@Injectable()
export class TemplateButtonService {
  constructor(
    @InjectRepository(TemplateButton)
    private readonly templateButtonRepository: Repository<TemplateButton>){
  }

  async create(createDto: CreateTemplateButtonDto) {
    
    let templateButton = {
      id: uuid(),
      name: createDto.name,
      description: createDto.description,
      type: createDto.type,
      formFields: createDto.formFields
    }
    
    await this.templateButtonRepository.insert([templateButton]);
    
    return templateButton;
  }

  findOne(id: string) {
    return this.templateButtonRepository.findOne({where: {id}});
  }

  update(id: string, updateDto: UpdateTemplateButtonDto) {
    let templateButton = {
      ...updateDto,
      id
    }

    return this.templateButtonRepository.save([templateButton]);
  }

  remove(id: string) {
    return this.templateButtonRepository.delete({id});
  }
}
  