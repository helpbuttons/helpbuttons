require('dotenv').config()

export default () => ({
  hostName: process.env.hostName,
  postgresHostName: process.env.POSTGRES_HOSTNAME ? process.env.POSTGRES_HOSTNAME : 'db',
  postgresDb: process.env.POSTGRES_DB,
  postgresUser: process.env.POSTGRES_USER,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresPort: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  smtpHost: process.env.smtpHost,
  smtpPort: process.env.smtpPort,
  smtpUser: process.env.smtpUser,
  smtpPass: process.env.smtpPass,
  from: process.env.from,
  jwtSecret: process.env.jwtSecret
});
