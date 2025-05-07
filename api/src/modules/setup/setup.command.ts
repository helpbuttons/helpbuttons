// import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import configs from '@src/config/configuration.js';

@Injectable()
export class SetupCommand {
  constructor() {}

  // @Command({
  //   command: 'config:genjwt',
  //   describe: 'generate jwt key for env file',
  // })
  async generateJwt() {
    const fs = require('fs');
    const { nanoid } = require('nanoid');
    console.log(`jwtSecret=${nanoid(36)}`)
  }
}
