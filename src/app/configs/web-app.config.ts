import { registerAs } from '@nestjs/config';

import { NodeEnv } from '@src/shared/types';
import { webAppConfigs } from '../types/web.type';

export default registerAs('webAppConfigs', (): webAppConfigs => {
  const configs = {
    nodeEnv:
      (process.env?.NODE_ENV as NodeEnv) ?? NodeEnv.development,
    host: process.env?.HOST ?? 'localhost',
    port: Number(process.env?.PORT) ?? 3000,
    baseUrl: process.env?.BASE_URL ?? '',
    swaggerPath: process.env?.SWAGGER_PATH ?? 'docs',
    allowedCors: process.env?.ALLOWED_CORS
  };

  configs.baseUrl = configs.host + ':' + configs.port.toString();
  return configs;
});
