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
import {UserProfile, SecurityBindings} from '@loopback/security';
import {authenticate} from '@loopback/authentication';
import { inject } from '@loopback/core';
import { TagController } from './tag.controller';

export class ButtonController {
  // protected currentUserProfile : UserProfile;
  constructor(
    // @inject(SecurityBindings.USER)
    // public currentUserProfile: UserProfile,
    @repository(ButtonRepository)
    public buttonRepository : ButtonRepository,
    @repository(NetworkRepository)
    public networkRepository : NetworkRepository,
    @repository(TemplateButtonRepository)
    public templateButtonRepository : TemplateButtonRepository,
    @inject('controllers.TagController') 
    public tagController: TagController,
  ) {
  }
  
  @authenticate('jwt')
  @post('/buttons/new/', {
    responses: {
      '200': {
        description: 'create a Button model instance',
        content: {'application/json': {schema: getModelSchemaRef(Button)}},
      },
    },
  })
  async create(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
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
    button.owner = currentUserProfile.id;
    if (!networkId) {
      throw new HttpErrors.UnprocessableEntity('Network id is not present');
    }

    await this.isOwnerOfNetwork(networkId, currentUserProfile);
    
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
  
  @authenticate('jwt')
  @post('/buttons/addToNetworks/{buttonId}', {
    responses: {
      '200': {
        description: 'Add a button to networks',
        content: {},
      },
    },
  })
  async addToNetworks(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    @param.path.number('buttonId') buttonId: number,
    @param.query.string('networks') networks: string,
  ): Promise<object> {
    const networkIds: Array<number> = JSON.parse(networks);
    
    const ownedNetworkIds = await this.networkRepository.findOwnerNetworks(currentUserProfile.id, networkIds);
    
    await this.isOwner(buttonId, currentUserProfile);
    
    return Promise.all(
      ownedNetworkIds.map((networkId) => {
            return this.networkRepository.buttons(networkId).link(buttonId).then(() => {
              return 'Adding button ' + buttonId + ' to network ' + networkId;
            }).catch((err) => { 
              // primary key restriction
            });
          })
    );
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
    // where not private
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
    // if not private
    return this.buttonRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/buttons/edit/{id}')
  @response(204, {
    description: 'Button PATCH success',
  })
  async updateById(
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
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
    await this.isOwner(id, currentUserProfile);
    await this.buttonRepository.updateById(id, button);
    if (button.tags) {
      await this.tagController.updateTags('button',id.toString(), button.tags);
    }
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
  @authenticate('jwt')
  @del('/buttons/delete/{id}')
  @response(204, {
    description: 'Button DELETE success',
  })
  async deleteById(
    @param.path.number('id') id: number,
    @inject(SecurityBindings.USER) currentUserProfile: UserProfile,
    ): Promise<void> {
    await this.isOwner(id, currentUserProfile);
    await this.buttonRepository.deleteById(id);
  }

  protected async isOwner(buttonId : number, currentUserProfile: UserProfile){
    const isOwnerOfButton = await this.buttonRepository.isOwner(currentUserProfile.id, buttonId);

    if (!isOwnerOfButton) {
      throw new HttpErrors.UnprocessableEntity('You are not the owner of the button');
    }
  }

  protected async isOwnerOfNetwork(networkId : number,currentUserProfile: UserProfile){
    const isOwnerOfNetwork = await this.networkRepository.isOwner(currentUserProfile.id, networkId);

    if (!isOwnerOfNetwork) {
      throw new HttpErrors.UnprocessableEntity('You are not the owner of the network');
    }
  }
}
