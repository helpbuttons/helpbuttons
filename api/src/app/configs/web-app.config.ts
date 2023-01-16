import { registerAs } from '@nestjs/config';
import { configFileName } from '@src/shared/helpers/config.helper';

import { NodeEnv } from '@src/shared/types';
import { WebAppConfigs } from '../types/web.type';

var configFile = require(`@src/../..${configFileName}`);

export default registerAs('webAppConfigs', (): WebAppConfigs => {
  const configs = 
  {
    // nodeEnv: configFile.nodeEnv ? configFile.nodeEnv :  NodeEnv.production,
    nodeEnv: NodeEnv.development,
    host: '0.0.0.0',
    port: 3001, //only internal
    hostName: configFile.hostName ? configFile.hostName : 'localhost',
    allowedCors: `http://${configFile.hostName}:${configFile.webPort}`,
    smtpUrl: configFile.smtpUrl,
    jwtSecret: configFile.jwtSecret
  };

  return configs;
});
