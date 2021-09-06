// import {
//   Count,
//   CountSchema,
//   Filter,
//   repository,
//   Where,
// } from '@loopback/repository';
//   import {
//   del,
//   get,
//   getModelSchemaRef,
//   getWhereSchemaFor,
//   param,
//   patch,
//   post,
//   requestBody,
// } from '@loopback/rest';
// import {
// Button,
// ButtonsNetwork,
// Network,
// } from '../models';
// import {ButtonRepository} from '../repositories';

// export class ButtonNetworkController {
//   constructor(
//     @repository(ButtonRepository) protected buttonRepository: ButtonRepository,
//   ) { }

//   @get('/buttons/{id}/networks', {
//     responses: {
//       '200': {
//         description: 'Array of Button has many Network through ButtonsNetwork',
//         content: {
//           'application/json': {
//             schema: {type: 'array', items: getModelSchemaRef(Network)},
//           },
//         },
//       },
//     },
//   })
//   async find(
//     @param.path.number('id') id: number,
//     @param.query.object('filter') filter?: Filter<Network>,
//   ): Promise<Network[]> {
//     return this.buttonRepository.networks(id).find(filter);
//   }

//   @post('/buttons/{id}/networks', {
//     responses: {
//       '200': {
//         description: 'create a Network model instance',
//         content: {'application/json': {schema: getModelSchemaRef(Network)}},
//       },
//     },
//   })
//   async create(
//     @param.path.number('id') id: typeof Button.prototype.id,
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(Network, {
//             title: 'NewNetworkInButton',
//             exclude: ['id'],
//           }),
//         },
//       },
//     }) network: Omit<Network, 'id'>,
//   ): Promise<Network> {
//     return this.buttonRepository.networks(id).create(network);
//   }

//   @patch('/buttons/{id}/networks', {
//     responses: {
//       '200': {
//         description: 'Button.Network PATCH success count',
//         content: {'application/json': {schema: CountSchema}},
//       },
//     },
//   })
//   async patch(
//     @param.path.number('id') id: number,
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(Network, {partial: true}),
//         },
//       },
//     })
//     network: Partial<Network>,
//     @param.query.object('where', getWhereSchemaFor(Network)) where?: Where<Network>,
//   ): Promise<Count> {
//     return this.buttonRepository.networks(id).patch(network, where);
//   }

//   @del('/buttons/{id}/networks', {
//     responses: {
//       '200': {
//         description: 'Button.Network DELETE success count',
//         content: {'application/json': {schema: CountSchema}},
//       },
//     },
//   })
//   async delete(
//     @param.path.number('id') id: number,
//     @param.query.object('where', getWhereSchemaFor(Network)) where?: Where<Network>,
//   ): Promise<Count> {
//     return this.buttonRepository.networks(id).delete(where);
//   }
// }
