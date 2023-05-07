import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Button } from '@src/modules/button/button.entity';
import { Network } from '@src/modules/network/network.entity';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { Seeder, DataFactory } from 'nestjs-seeder';
import { Repository } from 'typeorm';

@Injectable()
export class ButtonsSeeder implements Seeder {
  constructor(@InjectRepository(Button)
  private readonly buttonRepository: Repository<Button>,
  @InjectRepository(Network)
  private readonly networkRepository: Repository<Network>,
    ) {}

  async seed(): Promise<any> {
    const findNetwork = async ():Promise<Network> => {
      return this.networkRepository
      .find({ order: { created_at: 'ASC' } })
      .then((networks) => {
        if (networks.length < 1) {
          console.log('no network found')
        }
        return networks[0];
      })
      .catch((error) => {
        console.log('error, getting network')
        throw Error('lla')
      });
    }

    var allPoints = require('./data/points-flc.json')
    console.log(allPoints.results[0])
    // this.buttonRepository.new(
// 
    // )
      
    const buttonData = allPoints.results[0];
    const button = {
      id: dbIdGenerator(),
      type: buttonData.category,
      description: buttonData.Description,
      latitude: buttonData.Location.latitude,
      longitude: buttonData.Location.longitude,
      tags: [],
      location: () =>
        `ST_MakePoint(${buttonData.Location.latitude}, ${buttonData.Location.longitude})`,
      network: await findNetwork(),
      images: [],
      // owner: user,
      image: null,
      title: buttonData.Title,
      address: buttonData.address,
      when: JSON.stringify({ dates: [], type: 'alwaysOn' }),
    };
    console.log(button)

    await this.buttonRepository.insert([button])

    

  }

  async drop(): Promise<any> {
  }
}