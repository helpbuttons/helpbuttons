import {
  // Count,
  // CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  // Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  // put,
  del,
  requestBody,
  response,
  HttpErrors,
} from '@loopback/rest';
import {Button, Network} from '../models';
import {ButtonRepository, NetworkRepository, TemplateButtonRepository} from '../repositories';
import { Validations } from './validations';

import {authenticate} from '@loopback/authentication';
import { inject } from '@loopback/core';
import { TagController } from './tag.controller';

@authenticate('jwt')

export class ButtonController {
  constructor(
    @repository(ButtonRepository)
    public buttonRepository : ButtonRepository,
    @repository(NetworkRepository)
    public networkRepository : NetworkRepository,
    @repository(TemplateButtonRepository)
    public templateButtonRepository : TemplateButtonRepository,
    @inject('controllers.TagController') 
    public tagController: TagController,
  ) {}
  
  @post('/buttons/new', {
    responses: {
      '200': {
        description: 'create a Button model instance',
        content: {'application/json': {schema: getModelSchemaRef(Button)}},
      },
    },
  })
  async create(
    @param.query.number('networkId') networkId: typeof Network.prototype.id,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Button, {
            title: 'NewButtonInNetwork',
            exclude: ['id'],
          }),
        },
      },
    }) button: Omit<Button, 'id'>,
  ): Promise<Button> {
    if (button.geoPlace){
      if (!Validations.isGeoPoint(button.geoPlace)){
        throw new HttpErrors.UnprocessableEntity('`geoPlace` is not well formated, please check the documentation at https://geojson.org/');
      }
    }

    return this.networkRepository.buttons(networkId).create(button)
    .then((createdButton) => {
      if (!createdButton.id || !button.tags) {
        return createdButton;
      }
      return this.tagController.addTags('button',createdButton.id.toString(), button.tags).then(
         () => { return createdButton; }
      );
    });
  }
  
  @post('/buttons/addToNetworks', {
    responses: {
      '200': {
        description: 'Add a button to networks',
        content: {},
      },
    },
  })
  async addToNetworks(
    @param.query.number('buttonId') id: typeof Button.prototype.id,
    @param.query.string('networks') networks: string,
  ): Promise<object> {
    const networkIds: Array<number> = JSON.parse(networks);
    return Promise.all(
      networkIds.map((networkId) => {
        return this.networkRepository.buttons(networkId).link(id).then(() => {
          return 'Added button ' + id + ' to network ' + networkId;
        });
      })
    )
  }
/*
  @get('/buttons/count')
  @response(200, {
    description: 'Button model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Button) where?: Where<Button>,
  ): Promise<Count> {
    return this.buttonRepository.count(where);
  }
*/
  @get('/buttons/find')
  @response(200, {
    description: 'Array of Button model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Button, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Button) filter?: Filter<Button>,
  ): Promise<Button[]> {
    return this.buttonRepository.find(filter);
  }
/*
  @patch('/buttons')
  @response(200, {
    description: 'Button PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Button, {partial: true}),
        },
      },
    })
    button: Button,
    @param.where(Button) where?: Where<Button>,
  ): Promise<Count> {
    return this.buttonRepository.updateAll(button, where);
  }
*/
  @get('/buttons/findById/{id}')
  @response(200, {
    description: 'Button model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Button, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Button, {exclude: 'where'}) filter?: FilterExcludingWhere<Button>
  ): Promise<Button> {
    return this.buttonRepository.findById(id, filter);
  }

  @patch('/buttons/edit/{id}')
  @response(204, {
    description: 'Button PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Button, {partial: true}),
        },
      },
    })
    button: Button,
  ): Promise<void> {
    await this.buttonRepository.updateById(id, button);
    await this.tagController.updateTags('button',id.toString(), button.tags ? button.tags : []);
  }
/*
  @put('/buttons/{id}')
  @response(204, {
    description: 'Button PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() button: Button,
  ): Promise<void> {
    await this.buttonRepository.replaceById(id, button);
  }
*/
  @del('/buttons/delete/{id}')
  @response(204, {
    description: 'Button DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.buttonRepository.deleteById(id);
  }
}
