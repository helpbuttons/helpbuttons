import { configFileName } from "./shared/helpers/config.helper";

const fs = require('fs');
if (fs.existsSync(configFileName)) {
  var bootstrap = require('./bootstrap').bootstrap;
  const app = bootstrap();
} else {
  var setup = require('./setup').setup;
  const app = setup();
}