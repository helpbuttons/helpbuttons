require('dotenv').config()
const fs = require('fs')

let configs = {
  hostName: process.env.hostName,
  postgresHostName: process.env?.POSTGRES_HOSTNAME ? process.env.POSTGRES_HOSTNAME : 'localhost',
  postgresDb: process.env.POSTGRES_DB,
  postgresUser: process.env.POSTGRES_USER,
  postgresPassword: process.env.POSTGRES_PASSWORD,
  postgresPort: process.env?.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
  smtpHost: process.env.smtpHost,
  smtpPort: process.env.smtpPort,
  smtpUser: process.env.smtpUser,
  smtpPass: process.env.smtpPass,
  from: process.env.from,
  jwtSecret: process.env.jwtSecret,
  WEB_URL: process.env.WEB_URL,
  GEOCODE_APY_KEY: process.env?.GEOCODE_APY_KEY ? process.env.GEOCODE_APY_KEY : '',
  GEOCODE_LIMIT_COUNTRIES: process.env?.GEOCODE_LIMIT_COUNTRIES ? process.env.GEOCODE_LIMIT_COUNTRIES : ''
}

if (fs.existsSync(`${__dirname}/../../config/config.json`)) {
  configs = require(`${__dirname}/../../config/config.json`)
  console.log('loading old config..')
}

export default () => (configs);
