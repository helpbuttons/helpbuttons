import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>){
  }

  async find(tag: string) {
    return await this.tagRepository.find({ tag: `%${tag}` });
  }

  async addTags(modelName: string, modelId: string, tags: string[]) {
    let tagsToInsert = tags.map((tag) => {
        return {
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
