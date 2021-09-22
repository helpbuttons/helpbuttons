import {
  Filter,
  FilterExcludingWhere,
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {TemplateButton} from '../models';
import {NetworkRepository, TemplateButtonRepository} from '../repositories';

import {UserProfile, SecurityBindings} from '@loopback/security';
import { authenticate } from '@loopback/authentication';
import { inject } from '@loopback/core';

export class TemplateButtonController {
  constructor(
    @repository(TemplateButtonRepository)
    public templateButtonRepository : TemplateButtonRepository,
    @repository(NetworkRepository)
    public networkRepository : NetworkRepository,
  ) {}

  @authenticate('jwt')
  @post('/template-buttons/new')
  @response(200, {
    description: 'TemplateButton model instance',
    content: {'application/json': {schema: getModelSchemaRef(TemplateButton)}},
  })
  async create(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TemplateButton, {
            title: 'NewTemplateButton',
            exclude: ['id'],
          }),
        },
      },
    })
    templateButton: Omit<TemplateButton, 'id'>,
  ): Promise<TemplateButton> {
    templateButton.owner = currentUserProfile.id;
    return this.templateButtonRepository.create(templateButton);
  }
/*
  @get('/template-buttons/count')
  @response(200, {
    description: 'TemplateButton model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TemplateButton) where?: Where<TemplateButton>,
  ): Promise<Count> {
    return this.templateButtonRepository.count(where);
  }
*/
  @get('/template-buttons/find')
  @response(200, {
    description: 'Array of TemplateButton model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TemplateButton, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TemplateButton) filter?: Filter<TemplateButton>,
  ): Promise<TemplateButton[]> {
    return this.templateButtonRepository.find(filter);
  }
/*
  @patch('/template-buttons')
  @response(200, {
    description: 'TemplateButton PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TemplateButton, {partial: true}),
        },
      },
    })
    templateButton: TemplateButton,
    @param.where(TemplateButton) where?: Where<TemplateButton>,
  ): Promise<Count> {
    return this.templateButtonRepository.updateAll(templateButton, where);
  }
*/
  @get('/template-buttons/findById/{id}')
  @response(200, {
    description: 'TemplateButton model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TemplateButton, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(TemplateButton, {exclude: 'where'}) filter?: FilterExcludingWhere<TemplateButton>
  ): Promise<TemplateButton> {
    return this.templateButtonRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/template-buttons/edit/{id}')
  @response(204, {
    description: 'TemplateButton PATCH success',
  })
  async updateById(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TemplateButton, {partial: true}),
        },
      },
    })
    templateButton: TemplateButton,
  ): Promise<void> {
    await this.isOwner(id, currentUserProfile);
    await this.templateButtonRepository.updateById(id, templateButton);
  }
/*
  @put('/template-buttons/{id}')
  @response(204, {
    description: 'TemplateButton PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() templateButton: TemplateButton,
  ): Promise<void> {
    await this.templateButtonRepository.replaceById(id, templateButton);
  }
*/
  @authenticate('jwt')
  @del('/template-buttons/{id}')
  @response(204, {
    description: 'TemplateButton DELETE success',
  })
  async deleteById(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.path.number('id') id: number
  ): Promise<void> {
    await this.isOwner(id, currentUserProfile);
    await this.templateButtonRepository.deleteById(id);
  }

  @authenticate('jwt')
  @post('/template-buttons/addToNetworks', {
    responses: {
      '200': {
        description: 'Add a template button to networks',
        content: {},
      },
    },
  })
  async addToNetworks(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.query.number('templateButtonId') id: number,
    @param.query.string('networks') networks: string,
  ): Promise<object> {
    const networkIds: Array<number> = JSON.parse(networks);

    const ownedNetworkIds = await this.networkRepository.findOwnerNetworks(currentUserProfile.id, networkIds);
    
    return Promise.all(
      ownedNetworkIds.map((networkId) => {
        return this.networkRepository.templateButtons(networkId).link(id).then(() => {
          return 'Added template button ' + id + ' to network ' + networkId;
        });
      })
    )
  }

  protected async isOwner(buttonId : number, currentUserProfile: UserProfile){
    const isOwnerOfButton = await this.templateButtonRepository.isOwner(currentUserProfile.id, buttonId);

    if (!isOwnerOfButton) {
      throw new HttpErrors.UnprocessableEntity('You are not the owner of the button');
    }
  }
}
