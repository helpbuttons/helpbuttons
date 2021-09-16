import { injectable, inject, BindingScope } from '@loopback/core';
import { TagController } from '../controllers';
import { Tag } from '../models';


@injectable({ scope: BindingScope.TRANSIENT })
export class TagService {
  tagController: TagController;

  constructor(
    @inject('controllers.TagController') tagController: TagController,
  ) {
    this.tagController = tagController;
  }

  /*
   * Add service methods here
   */
  async addTags(modelName: string, modelId: string, tags: string[]) {
    tags.forEach(async (tag) => {
      await this.tagController.tagRepository.create({
        "id": tag,
        "modelName": modelName,
        "modelId": modelId
      });
    });
  }

  async updateTags(modelName: string, modelId: string, tags: string[]) :Promise<boolean>{
    
    await this.tagController.tagRepository.deleteAll({
      "and": [{
        "modelName": modelName,
        "modelId": modelId
      }]
    });
    
    tags.forEach(async (tag) => {
      await this.tagController.tagRepository.create({
        "id": tag,
        "modelName": modelName,
        "modelId": modelId
      });
    });
    return true;
  }

  async findByTag(tag: string) : Promise<Tag[]> {
    // find a tag and return links to models!!
    return this.tagController.find()
  }

  findByTags(tags: string[]) {
    // find tags and return links to models...!
  }
}
