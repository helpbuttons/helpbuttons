import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

import { AuthConfig } from './auth.type';

export default registerAs('authConfig', (): AuthConfig => {
  const { ACTIVATION_URL } = process.env;
  const validatedEnvs = validate({ ACTIVATION_URL });

  return {
    activationUrl: validatedEnvs.ACTIVATION_URL,
  };
});

function validate(
  config: Record<string, any>,
): EnvironmentalVariables {
  const validatedConfigs = plainToInstance(
    EnvironmentalVariables,
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

class EnvironmentalVariables {
  @IsString()
  ACTIVATION_URL: string;
}
