import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
  
  constructor(@InjectRepository(Tag)
  private readonly tagRepository: Repository<Tag>) {}

  async createTag(tag: Tag) {
    const createdTag = this.tagRepository.create({
      id: dbIdGenerator(),
      ...(tag.modelId ? { modelId: tag.modelId } : {}),
      ...(tag.modelName ? { modelName: tag.modelName } : {}),
      tag: tag.tag,
    });

    await this.tagRepository.save(createdTag);

    return createdTag;
  }

  async find(tag: string) {
    return await this.tagRepository.find({ where: {tag: `%${tag}`} });
  }

  async addTags(modelName: string, modelId: string, tags: string[]) {
    let tagsToInsert = tags.filter(tag => tag.length > 0).map((tag) => {
      return {
        id: dbIdGenerator(),
        modelName: modelName,
        modelId: modelId,
        tag: tag,
      };
    });
    return await this.tagRepository.insert(tagsToInsert);
  }

  async updateTags(
    modelName: string,
    modelId: string,
    tags: string[],
  ) {
    let tagsToInsert = tags.map((tag) => {
      return {
        modelName: modelName,
        modelId: modelId,
        tag: tag,
      };
    });
    // await this.tagRepository.delete({modelName, modelId})
    return await this.tagRepository.insert(tagsToInsert);
  }
}
