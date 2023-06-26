import { configFullPath } from "./shared/helpers/config.helper";

const fs = require('fs');
if (fs.existsSync(configFullPath)) {
  console.log('setup files found.. running normal mode')
  var bootstrap = require('./bootstrap').bootstrap;
  const app = bootstrap();
} else {
  console.log('no setup files found.. running in setup mode')
  var setup = require('./setup').setup;
  const app = setup();
}