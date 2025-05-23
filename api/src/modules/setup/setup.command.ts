// import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import configs from '@src/config/configuration.js';
import { uuid } from '@src/shared/helpers/uuid.helper.js';

@Injectable()
export class SetupCommand {
  constructor() {}

  // @Command({
  //   command: 'config:genjwt',
  //   describe: 'generate jwt key for env file',
  // })
  async generateJwt() {
    const fs = require('fs');
    const jwt = uuid()
    console.log(`jwtSecret=${jwt}`)
  }

  // @Command({
  //   command: 'config:convert',
  //   describe: 'converts old config.json to .env',
  // })
  
  async convertToEnv() {
    const fs = require('fs');

    const convertKeys = {
      postgresHostName: 'POSTGRES_HOSTNAME',
      postgresDb: 'POSTGRES_DB',
      postgresUser: 'POSTGRES_USER',
      postgresPassword: 'POSTGRES_PASSWORD',
      postgresPort: 'POSTGRES_PORT',
    };

    const out = Object.keys(configs()).map((entry) => {
      let entryOut = entry;
      if (convertKeys.hasOwnProperty(entry)) {
        entryOut = convertKeys[entry];
      }
      if (entry == 'from')
      {
        return `${entryOut}="${configs()[entry]}"`;
      }
      return `${entryOut}=${configs()[entry]}`;
    });

    console.log('writing .env...')
    console.log('copy this into your .env file:')
    console.log(out.join('\n'))
  }
}
