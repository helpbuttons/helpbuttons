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
// Network,
// ButtonsNetwork,
// Button,
// } from '../models';
// import {NetworkRepository} from '../repositories';

// export class NetworkButtonController {
//   constructor(
//     @repository(NetworkRepository) protected networkRepository: NetworkRepository,
//   ) { }

//   @get('/networks/{id}/buttons', {
//     responses: {
//       '200': {
//         description: 'Array of Network has many Button through ButtonsNetwork',
//         content: {
//           'application/json': {
//             schema: {type: 'array', items: getModelSchemaRef(Button)},
//           },
//         },
//       },
//     },
//   })
//   async find(
//     @param.path.number('id') id: number,
//     @param.query.object('filter') filter?: Filter<Button>,
//   ): Promise<Button[]> {
//     return this.networkRepository.buttons(id).find(filter);
//   }

//   @post('/networks/{id}/buttons', {
//     responses: {
//       '200': {
//         description: 'create a Button model instance',
//         content: {'application/json': {schema: getModelSchemaRef(Button)}},
//       },
//     },
//   })
//   async create(
//     @param.path.number('id') id: typeof Network.prototype.id,
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(Button, {
//             title: 'NewButtonInNetwork',
//             exclude: ['id'],
//           }),
//         },
//       },
//     }) button: Omit<Button, 'id'>,
//   ): Promise<Button> {
//     return this.networkRepository.buttons(id).create(button);
//   }

//   @patch('/networks/{id}/buttons', {
//     responses: {
//       '200': {
//         description: 'Network.Button PATCH success count',
//         content: {'application/json': {schema: CountSchema}},
//       },
//     },
//   })
//   async patch(
//     @param.path.number('id') id: number,
//     @requestBody({
//       content: {
//         'application/json': {
//           schema: getModelSchemaRef(Button, {partial: true}),
//         },
//       },
//     })
//     button: Partial<Button>,
//     @param.query.object('where', getWhereSchemaFor(Button)) where?: Where<Button>,
//   ): Promise<Count> {
//     return this.networkRepository.buttons(id).patch(button, where);
//   }

//   @del('/networks/{id}/buttons', {
//     responses: {
//       '200': {
//         description: 'Network.Button DELETE success count',
//         content: {'application/json': {schema: CountSchema}},
//       },
//     },
//   })
//   async delete(
//     @param.path.number('id') id: number,
//     @param.query.object('where', getWhereSchemaFor(Button)) where?: Where<Button>,
//   ): Promise<Count> {
//     return this.networkRepository.buttons(id).delete(where);
//   }
// }
