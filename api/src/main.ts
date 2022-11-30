const fs = require('fs');
if (fs.existsSync('config.json')) {
  var bootstrap = require('./bootstrap').bootstrap;
  const app = bootstrap();
} else {
  var setup = require('./setup').setup;
  const app = setup();
}