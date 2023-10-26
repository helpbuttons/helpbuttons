import { Injectable } from '@nestjs/common';
import {
  InjectRepository,
} from '@nestjs/typeorm';
import { Button } from '@src/modules/button/button.entity';
import { Network } from '@src/modules/network/network.entity';
import { Post } from '@src/modules/post/post.entity';
import { User } from '@src/modules/user/user.entity';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';
import { maxResolution } from '@src/shared/types/honeycomb.const';
import { Role } from '@src/shared/types/roles';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

function readableDate(date: Date, locale) {
  if(typeof date !== typeof Date) {
    date = new Date(date)
  }
  return date.toLocaleDateString(locale, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });
}
@Injectable()
export class ButtonsSeeder implements Seeder {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Button)
    private readonly buttonRepository: Repository<Button>,
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(Network)
    private readonly networkRepository: Repository<Network>
  ) {}

  async seed(): Promise<any> {
    var users = require('./ia.users.json');
    var buttons = require('./ia.buttons.json');

    const usersId = []
    const userMails = []
    const usersToAdd = users.users.map((userJson) => {
      const userId = dbIdGenerator()
      userMails.push({id: userId, mail: userJson.email})
      return {
        username: userJson.username,
        email: userJson.email,
        role: Role.registered,
        name: userJson.name,
        verificationToken: dbIdGenerator(),
        emailVerified: true,
        id: userId,
        avatar: '/files/get/' + userJson.avatar,
        description: userJson.description, 
        locale: userJson.locale,
        receiveNotifications: false,
      }
      
    });
    
    // await this.userRepository.insert(usersToAdd);
    console.log(`Added ${usersToAdd.length} users`)

    let btnIds =[]
    // const network = await this.networkService.findDefaultNetwork();
    const network = await this.networkRepository.find({ order: { created_at: 'ASC' } });

    const buttonTemplates = JSON.parse(network[0].buttonTemplates)
    console.log('success')
    
    const buttonTypes = buttonTemplates.map((btnTemplate) => btnTemplate.name.toLowerCase())
    console.log('button types found:')
    console.log(JSON.stringify(buttonTemplates))
    const btns = buttons.buttons.filter((button) => {
      if (buttonTypes.indexOf(button.type) > -1){
        return true;
      }
      console.log(`'${button.type}' type not found.`)
      return false;
    })
    
    const buttonsToAdd = await Promise.all(btns.map(async (buttonJson) => {
      const user = await this.userRepository.findOne({where: {email: buttonJson.email}})
      const lat = buttonJson.place.latitude
      const lng = buttonJson.place.longitude
      const btnId = dbIdGenerator()
      btnIds.push(btnId)
      return {
        id: btnId,
        type: buttonJson.type,
        description: buttonJson.description,
        latitude: lat,
        longitude: lng,
        tags: buttonJson.tags,
        location: () =>
          `ST_MakePoint(${lat}, ${lng})`,
        network: network,
        images: [],
        owner: user,
        image: '/files/get/' + buttonJson.image,
        title: buttonJson.title,
        address: buttonJson.place.address,
        when: '{"dates":[],"type":null}',
        hexagon: () => `h3_lat_lng_to_cell(POINT(${lng}, ${lat}), ${maxResolution})`
      };
      
    }));
    let buttonsAdded = await this.buttonRepository.insert(buttonsToAdd);
    const postsToAdd = buttonsToAdd.map((button) => {
      return {
        id: dbIdGenerator(),
        button: button.id,
        author: button.owner,
        message: `Hi! I created this helpbutton at ${readableDate(new Date(),'en')}, leave a comment if you want`
      }
    })
    await this.postRepository.insert(postsToAdd)
    console.log(`Added ${buttonsToAdd.length} buttons`)
  }

  async pointsFlc() {
    // var allPoints = require('./data/points-flc.json');
    // const network = await this.networkService.findDefaultNetwork();
    // const buttons = await allPoints.results.map(async (buttonData, idx) => {
    // const button = {
    //   id: dbIdGenerator(),
    //   type: buttonData.category,
    //   description: buttonData.Description,
    //   latitude: buttonData.Location.latitude,
    //   longitude: buttonData.Location.longitude,
    //   tags: [],
    //   location: () =>
    //     `ST_MakePoint(${buttonData.Location.latitude}, ${buttonData.Location.longitude})`,
    //   network: network,
    //   owner: network.administrator,
    //   title: buttonData.Title,
    //   when: JSON.stringify({ dates: [], type: 'alwaysOn' }),
    //   hexagon: latLngToCell(buttonData.Location.latitude,buttonData.Location.longitude, maxResolution)
    // };
    //  return this.buttonRepository.insert([button]).then((result) => {
    //   return result;
    // }).catch((error) => {
    //   console.log('error');
    //   console.log(error);
    //   console.log(button)
    //   throw Error('error')})
    // })
    // return await Promise.all(buttons)
  }

  async drop(): Promise<any> {}
}
