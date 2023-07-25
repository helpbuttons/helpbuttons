import { NodeEnv } from '@src/shared/types';

export interface WebAppConfigs {
  nodeEnv: NodeEnv;
  host: string;
  port: number;
}
