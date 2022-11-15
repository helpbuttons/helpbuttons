import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

import { NodeEnv } from '@src/shared/types';

class EnvironmentVariables {
  @IsOptional()
  @IsEnum(NodeEnv)
  NODE_ENV?: NodeEnv;

  @IsOptional()
  @IsString()
  HOSTNAME?: string;

  @IsOptional()
  @IsString()
  ALLOWED_CORS?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfigs = plainToInstance(
    EnvironmentVariables,
    config,
    { enableImplicitConversion: true },
  );
  const validatedConfigsErrors = validateSync(validatedConfigs, {
    skipMissingProperties: false,
  });

  if (validatedConfigsErrors.length > 0) {
    console.dir({
      errors: validatedConfigsErrors.map((error) => ({
        value: error.value,
        property: error.property,
        message: Object.values(error.constraints!)[0],
      })),
      message:
        'Application could not load required environment variables',
    });
    throw new Error(validatedConfigsErrors.toString());
  }

  return validatedConfigs;
}
