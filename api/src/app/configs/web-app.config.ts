import { registerAs } from '@nestjs/config';
import { NodeEnv } from '@src/shared/types/index.js';
import { WebAppConfigs } from '../types/web.type.js';

export default registerAs('webAppConfigs', (): WebAppConfigs => {
  const configs = 
  {
    nodeEnv: NodeEnv.development,
    host: '0.0.0.0',
    port: 3001, //only internal
  };

  return configs;
});
