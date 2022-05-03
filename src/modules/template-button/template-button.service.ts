import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository } from 'typeorm';
import { CreateTemplateButtonDto,UpdateTemplateButtonDto } from './template-button.dto';
import { TemplateButton } from './template-button.entity';

@Injectable()
export class TemplateButtonService {
  constructor(
    @InjectRepository(TemplateButton)
    private readonly templateButtonRepository: Repository<TemplateButton>){
  }

  async create(createDto: CreateTemplateButtonDto) {
    
    let templateButton = {
      id: dbIdGenerator(),
      name: createDto.name,
      description: createDto.description,
      type: createDto.type,
      formFields: createDto.formFields
    }
    
    console.log(templateButton);
    await this.templateButtonRepository.insert([templateButton]);
    
    return templateButton;
  }

  findOne(id: string) {
    return `This action returns a #${id} templateButton`;
  }

  update(id: string, updateTemplateButtonDto: UpdateTemplateButtonDto) {
    return `This action updates a #${id} templateButton`;
  }

  remove(id: string) {
    return `This action removes #${id} templateButton`;
  }
}
  