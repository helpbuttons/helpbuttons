import { NodeEnv } from '@src/shared/types';

export interface webAppConfigs {
  nodeEnv: NodeEnv;
  host: string;
  port: number;
  hostName: string;
  allowedCors: string;
}
