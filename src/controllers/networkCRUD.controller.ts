import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Network} from '../models';
import {NetworkRepository} from '../repositories';

export class NetworkCRUDController {
  constructor(
    @repository(NetworkRepository)
    public networkRepository : NetworkRepository,
  ) {}

  @post('/networksCRUD')
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

  @get('/networksCRUD/count')
  @response(200, {
    description: 'Network model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Network) where?: Where<Network>,
  ): Promise<Count> {
    return this.networkRepository.count(where);
  }

  @get('/networksCRUD')
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

  @patch('/networksCRUD')
  @response(200, {
    description: 'Network PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Network, {partial: true}),
        },
      },
    })
    network: Network,
    @param.where(Network) where?: Where<Network>,
  ): Promise<Count> {
    return this.networkRepository.updateAll(network, where);
  }

  @get('/networksCRUD/{id}')
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

  @patch('/networksCRUD/{id}')
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

  @put('/networksCRUD/{id}')
  @response(204, {
    description: 'Network PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() network: Network,
  ): Promise<void> {
    await this.networkRepository.replaceById(id, network);
  }

  @del('/networksCRUD/{id}')
  @response(204, {
    description: 'Network DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.networkRepository.deleteById(id);
  }
}
