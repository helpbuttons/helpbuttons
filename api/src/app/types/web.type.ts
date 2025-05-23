import { NodeEnv } from '@src/shared/types/index.js';

export interface WebAppConfigs {
  nodeEnv: NodeEnv;
  host: string;
  port: number;
}
