import {
  Filter,
  // FilterExcludingWhere,
  repository,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  // patch,
  // put,
  // del,
  requestBody,
  response,
} from '@loopback/rest';
import {Network} from '../models';
import {NetworkRepository} from '../repositories';

export class NetworkController {
  constructor(
    @repository(NetworkRepository)
    public networkRepository : NetworkRepository,
  ) {}

  @post('/networks/new')
  @response(200, {
    description: 'Network model instance',
    content: {'application/json': {schema: getModelSchemaRef(Network)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Network, {
            title: 'NewNetwork',
            exclude: ['id'],
          }),
        },
      },
    })
    network: Omit<Network, 'id'>,
  ): Promise<Network> {
    return this.networkRepository.create(network);
  }

  @get('/networks/find')
  @response(200, {
    description: 'Array of Network model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Network, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Network) filter?: Filter<Network>,
  ): Promise<Network[]> {
    return this.networkRepository.find(filter);
  }
/*
  @get('/networks/{id}')
  @response(200, {
    description: 'Network model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Network, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Network, {exclude: 'where'}) filter?: FilterExcludingWhere<Network>
  ): Promise<Network> {
    return this.networkRepository.findById(id, filter);
  }

  @patch('/networks/{id}')
  @response(204, {
    description: 'Network PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Network, {partial: true}),
        },
      },
    })
    network: Network,
  ): Promise<void> {
    await this.networkRepository.updateById(id, network);
  }

  @put('/networks/{id}')
  @response(204, {
    description: 'Network PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() network: Network,
  ): Promise<void> {
    await this.networkRepository.replaceById(id, network);
  }

  @del('/networks/{id}')
  @response(204, {
    description: 'Network DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.networkRepository.deleteById(id);
  }*/
}
