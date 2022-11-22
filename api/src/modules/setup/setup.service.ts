import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SetupDto } from './setup.entity';
import { DataSource } from 'typeorm';
import * as fs from 'fs';
import { dbIdGenerator } from '@src/shared/helpers/nanoid-generator.helper';


@Injectable()
export class SetupService {
  constructor(
  ) {}

  smtpTest(smtpUrl: string): boolean {
    return false;
  }
  
  async save(setupDto: SetupDto) {
    if(!this.isDatabaseReady(setupDto)) {
      throw new HttpException(
        { message: "Can't connect to the database." },
        HttpStatus.UNAUTHORIZED,
      );
    }
    fs.writeFileSync('config.json', JSON.stringify({...setupDto, ...{jwtSecret: dbIdGenerator(), }}));
  }

  get()
  {
    const dataJSON = fs.readFileSync('config.json', 'utf8')
    const data: SetupDto = new SetupDto(JSON.parse(dataJSON))

    const dataToWeb = 
    {
      hostName: data.hostName,
      mapifyApiKey: data.mapifyApiKey,
      leafletTiles: data.leafletTiles,
      allowedDomains: data.allowedDomains,
    }
    
    return JSON.stringify(dataToWeb)
  }


  private isDatabaseReady(setupDto: SetupDto) : boolean {
    console.log('need to connect to database')
    return true;
    
    
    const dataSource = new DataSource({
      type: 'postgres',
      host: setupDto.hostName,
      port: setupDto.postgresPort,
      username: setupDto.postgresUser,
      password: setupDto.postgresPassword,
      database: setupDto.postgresDb,
    });

    // dataSource.query("SELECT * FROM ");
    return false;
// 
    // return dataSource.initialize();
  }
}

