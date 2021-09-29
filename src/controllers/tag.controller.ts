import {
  Filter,
  repository,
} from '@loopback/repository';
import {
  param,
  get,
  getModelSchemaRef,
  response,
} from '@loopback/rest';
import { Tag } from '../models';
import { TagRepository } from '../repositories';

export class TagController {
  constructor(
    @repository(TagRepository)
    public tagRepository: TagRepository,
  ) { }

  @get('/tags')
  @response(200, {
    description: 'Array of Tag model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Tag, { includeRelations: true }),
        },
      },
    },
  })
  async find(
    @param.filter(Tag) filter?: Filter<Tag>,
  ): Promise<Tag[]> {
    return this.tagRepository.find(filter);
  }

  @get('/tags/findByTag/{id}')
  @response(200, {
    description: 'Tag model instance',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Tag, { includeRelations: true }),
        },
      },
    },
  })
  async findById(
    @param.path.string('id') id: string, 
    @param.filter(Tag,  { exclude: 'where' }) filter?: Filter<Tag>,
  ): Promise<Tag[]> {
    filter = { ...filter, ...{'where': {'id': id}}};
    return this.tagRepository.find(filter);
  }

  async addTags(modelName: string, modelId: string, tags: string[]) {
    return tags.map((tag) => {
      return this.tagRepository.create({
        "id": tag,
        "modelName": modelName,
        "modelId": modelId
      });
    });
  }

  async updateTags(modelName: string, modelId: string, tags: string[]): Promise<boolean> {

    return this.tagRepository.deleteAll({
      "and": [{
        "modelName": modelName,
        "modelId": modelId
      }]
    }).then(() => {
      tags.map(async (tag) => {
        return this.tagRepository.create({
          "id": tag,
          "modelName": modelName,
          "modelId": modelId
        });
      });
      return true;
    });
  }

  async findByTag(tag: string): Promise<Tag[]> {
    // find a tag and return links to models!!
    return this.find();
  }

  findByTags(tags: string[]) {
    // find tags and return links to models...!
  }
}
