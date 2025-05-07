import { Injectable } from '@nestjs/common';
import {
  InjectRepository,
} from '@nestjs/typeorm';
import { Button } from '@src/modules/button/button.entity.js';
import { Network } from '@src/modules/network/network.entity.js';
import { Post } from '@src/modules/post/post.entity.js';
import { User } from '@src/modules/user/user.entity.js';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper.js';
import { maxResolution } from '@src/shared/types/honeycomb.const.js';
import { Role } from '@src/shared/types/roles.js';
import { Seeder } from 'nestjs-seeder';
import { Repository } from 'typeorm';

function readableDate(date: Date, locale) {
  if (typeof date !== typeof Date) {
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
  ) { }

  async seed(): Promise<any> {
    var users = require('./ia.users.json');
    var buttons = require('./ia.buttons.json');

    const usersId = []
    const userMails = []
    const usersToAdd = users.users.map((userJson) => {
      const userId = dbIdGenerator()
      userMails.push({ id: userId, mail: userJson.email })
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

    // add users:
    // await this.userRepository.insert(usersToAdd);
    const usersFound = await this.userRepository.find(usersToAdd);
    console.log(`Found ${usersFound.length} users`)

    let btnIds = []
    const network = await this.networkRepository.find({ order: { created_at: 'ASC' } });

    const buttonTemplates = network[0].buttonTemplates
    const buttonTypes = buttonTemplates.map((btnTemplate) => btnTemplate.name)
    console.log('button types found:')
    console.log(JSON.stringify(buttonTemplates))
    const btns = buttons.buttons.filter((button) => {
      if (buttonTypes.indexOf(button.type) > -1) {
        return true;
      }
      console.log(`'${button.type}' type not found.`)
      return false;
    })

    const buttonsToAdd = this.generateEvents(1000, buttonTypes, usersFound, network)
    
    let buttonsAdded = await this.buttonRepository.insert(buttonsToAdd);
    const postsToAdd = buttonsToAdd.map((button) => {
      return {
        id: dbIdGenerator(),
        button: button.id,
        author: button.owner,
        message: `Hi! I created this helpbutton at ${readableDate(new Date(), 'en')}, leave a comment if you want`
      }
    })
    await this.postRepository.insert(postsToAdd)
    console.log(`Added ${buttonsToAdd.length} buttons`)
  }

  async drop(): Promise<any> { }


  generateEvents(count, buttonTypes, users, network) {
    function getRandomItem(items) {
      const min = Math.ceil(0);
      const max = Math.floor(items.length - 1);
      const itemIdx = Math.floor(Math.random() * (max - min + 1)) + min;
      return items[itemIdx]
    }

    const tagsPool = ["photography", "workshop", "nature", "history", "tour", "culture", "art", "exhibition", "gallery"];
    const cities = [
      { name: "Barcelona", latitude: 41.3851, longitude: 2.1734 },
      { name: "Lisbon", latitude: 38.7223, longitude: -9.1393 },
      { name: "London", latitude: 51.5074, longitude: -0.1278 },
      { name: "Paris", latitude: 48.8566, longitude: 2.3522 },
      { name: "Berlin", latitude: 52.5200, longitude: 13.4050 },
      { name: "Rome", latitude: 41.9028, longitude: 12.4964 },
      { name: "Vienna", latitude: 48.2082, longitude: 16.3738 },
      { name: "Amsterdam", latitude: 52.3676, longitude: 4.9041 },
      { name: "Prague", latitude: 50.0755, longitude: 14.4378 },
      { name: "Athens", latitude: 37.9838, longitude: 23.7275 }
    ];

    const events = [];
    for (let i = 0; i < count; i++) {
      const city = cities[Math.floor(Math.random() * cities.length)];
      const tags = Array.from({ length: 3 }, () => tagsPool[Math.floor(Math.random() * tagsPool.length)]);
      const user = getRandomItem(users)
      if(!user?.email){
        continue;
      }
      
      events.push({
        id: dbIdGenerator(),
        type: getRandomItem(buttonTypes),
        description: `This is a description for event ${i + 1}. It includes details about the event and its purpose.`,
        latitude: city.latitude,
        longitude:  city.longitude,
        tags: tags,
        location: () =>
          `ST_MakePoint(${city.latitude}, ${ city.longitude})`,
        network: network,
        images: [],
        owner: user,
        image: null,
        title: `Event Title ${i + 1}`,
        address:  `${city.name}, Europe`,
        when: '{"dates":[],"type":null}',
        hexagon: () => `h3_lat_lng_to_cell(POINT(${ city.longitude}, ${city.latitude}), ${maxResolution})`
      });
    }
    return events;
  }
}


