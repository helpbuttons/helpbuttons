import {api} from '@loopback/rest';
import {def} from './network.controller.api';
import {NetworkRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {Network} from '../models';
import {
    Filter,
    Where,
  } from '@loopback/repository';

@api(def)
export class NetworkController {
  constructor(
    @repository('NetworkRepository')
    private NetworkRepository: NetworkRepository,
  ) {}

  async new(networkInstance: {
        name: string;
        url: string;
        avatar: string;
        description: string;
        privacy: string;
        place: string;
        latitude: number;
        longitude: number;
        radius: number;
        template: object;
  }): Promise<Object> {
    return await this.NetworkRepository.new(networkInstance);
  }
}
