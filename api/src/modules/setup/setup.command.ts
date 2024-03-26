import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SetupCommand {
  constructor() {}

  @Command({
    command: 'config:genjwt',
    describe: 'generate jwt key for env file',
  })
  async generateJwt() {
    const fs = require('fs');
    const { nanoid } = require('nanoid');

    const data = fs.readFileSync('./.env', 'utf8');
    const regex = /jwtSecret.+[\r\n]+/gm;
    const subst = `jwtSecret=${nanoid(36)}\n\r`;

    const result = data.replace(regex, subst);
    fs.writeFileSync('./.env', result);
  }

  @Command({
    command: 'config:convert',
    describe: 'converts old config.json to .env',
  })
  async convertToEnv() {
    const configs = require('@src/../config/config.json');
    const fs = require('fs');

    const convertKeys = {
      postgresHostName: 'POSTGRES_HOSTNAME',
      postgresDb: 'POSTGRES_DB',
      postgresUser: 'POSTGRES_USER',
      postgresPassword: 'POSTGRES_PASSWORD',
      postgresPort: 'POSTGRES_PORT',
    };

    const out = Object.keys(configs).map((entry) => {
      let entryOut = entry;
      if (convertKeys.hasOwnProperty(entry)) {
        entryOut = convertKeys[entry];
      }
      return `${entryOut}=${configs[entry]}`;
    });

    console.log('writing to env:')
    fs.writeFileSync('./.env', out.join('\n'))
  }
}
