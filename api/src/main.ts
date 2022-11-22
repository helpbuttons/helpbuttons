const fs = require('fs');

// check config
if (!isConfigFileCreated()) {
  console.log('Starting setup mode...')
  var setup = require('./setup').setup;
  const app = setup();
  app.listen
}else {
  var bootstrap = require('./bootstrap').bootstrap;
  const app = bootstrap();
  app.listen
}

function isConfigFileCreated() {
  return fs.existsSync('config.json')
}
