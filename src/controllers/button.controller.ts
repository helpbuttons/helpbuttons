import {
  // Count,
  // CountSchema,
  Filter,
  // FilterExcludingWhere,
  repository,
  // Where,
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
import {Button} from '../models';
import {ButtonRepository} from '../repositories';

export class ButtonController {
  constructor(
    @repository(ButtonRepository)
    public buttonRepository : ButtonRepository,
  ) {}

  @post('/buttons/new')
  @response(200, {
    description: 'Button model instance',
    content: {'application/json': {schema: getModelSchemaRef(Button)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Button, {
            title: 'NewButton',
            exclude: ['id'],
          }),
        },
      },
    })
    button: Omit<Button, 'id'>,
  ): Promise<Button> {
    return this.buttonRepository.create(button);
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

  @get('/buttons/{id}')
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

  @patch('/buttons/{id}')
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
  }

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

  @del('/buttons/{id}')
  @response(204, {
    description: 'Button DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.buttonRepository.deleteById(id);
  }
  */
}
