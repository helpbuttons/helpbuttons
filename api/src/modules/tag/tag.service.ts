import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { uuid } from '@src/shared/helpers/uuid.helper.js';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity.js';
import { tagify } from '@src/shared/helpers/tagify.helper.js';

@Injectable()
export class TagService {
  
  constructor(@InjectRepository(Tag)
  private readonly tagRepository: Repository<Tag>) {}

  formatTags(tags: string[])
  {
    return tags.map((tag) => tagify(tag))
  }

  async createTag(tag: Tag) {
    const createdTag = this.tagRepository.create({
      id: uuid(),
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
        id: uuid(),
        modelName: modelName,
        modelId: modelId,
        tag: tagify(tag),
      };
    });
    return await this.tagRepository.insert(tagsToInsert).then((value) => tagsToInsert.map((tagInserted) => tagInserted.tag));
  }

  async updateTags(
    modelName: string,
    modelId: string,
    tags: string[],
  ) {
    let tagsToInsert = tags.map((tag) => {
      return {
        id: uuid(),
        modelName: modelName,
        modelId: modelId,
        tag: tagify(tag),
      };
    });
    // await this.tagRepository.delete({modelName, modelId})
    return await this.tagRepository.insert(tagsToInsert).then((value) => tagsToInsert.map((tagInserted) => tagInserted.tag));
  }
}
