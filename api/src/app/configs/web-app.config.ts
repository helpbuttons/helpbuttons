import { registerAs } from '@nestjs/config';

import { NodeEnv } from '@src/shared/types';
import { webAppConfigs } from '../types/web.type';

export default registerAs('webAppConfigs', (): webAppConfigs => {
  const configs = {
    nodeEnv:
      (process.env?.NODE_ENV as NodeEnv) ?? NodeEnv.development,
    host: '0.0.0.0',
    port: 3001, //only internal
    hostName: process.env.HOSTNAME ? process.env.HOSTNAME : 'localhost',
    allowedCors: process.env.ALLOWED_CORS ? process.env.ALLOWED_CORS : 'http://localhost:3000',
  };

  return configs;
});
