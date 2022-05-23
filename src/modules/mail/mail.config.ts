import { registerAs } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { IsString, validateSync } from 'class-validator';

import { MailConfig } from './mail.type';

export default registerAs('mailConfig', (): MailConfig => {
  const { SMTP_URL } = process.env;
  const validatedEnvs = validate({ SMTP_URL });

  return {
    smtpUrl: validatedEnvs.SMTP_URL,
  };
});

function validate(
  configs: Record<string, any>,
): EnvironmentalVariables {
  const validatedConfigs = plainToInstance(
    EnvironmentalVariables,
    configs,
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
  SMTP_URL: string;
}
