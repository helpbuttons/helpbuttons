import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Button } from '@src/modules/button/button.entity';
import { ButtonService } from '@src/modules/button/button.service';
import { NetworkService } from '@src/modules/network/network.service';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { maxResolution } from '@src/shared/types/honeycomb.const';
import { latLngToCell } from 'h3-js';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { Repository } from 'typeorm';

@Injectable()
export class ButtonsSeeder implements Seeder {
  constructor(
    private readonly networkService: NetworkService,
    @InjectRepository(Button)
    private readonly buttonRepository: Repository<Button>
  ) {}

  async seed(): Promise<any> {
    var allPoints = require('./data/points-flc.json');
    const network = await this.networkService.findDefaultNetwork();

    const buttons = await allPoints.results.map(async (buttonData, idx) => {

    const button = {
      id: dbIdGenerator(),
      type: buttonData.category,
      description: buttonData.Description,
      latitude: buttonData.Location.latitude,
      longitude: buttonData.Location.longitude,
      tags: [],
      location: () =>
        `ST_MakePoint(${buttonData.Location.latitude}, ${buttonData.Location.longitude})`,
      network: network,
      owner: network.administrator,
      title: buttonData.Title,
      when: JSON.stringify({ dates: [], type: 'alwaysOn' }),
      hexagon: latLngToCell(buttonData.Location.latitude,buttonData.Location.longitude, maxResolution)
    };
     return this.buttonRepository.insert([button]).then((result) => {
      return result;
    }).catch((error) => {
      console.log('error');
      console.log(error); 
      console.log(button)
      throw Error('error')})
    })

    await Promise.all(buttons)
  }

  async drop(): Promise<any> {}
}
