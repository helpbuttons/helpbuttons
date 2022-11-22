const fs = require('fs');

init();

async function init () {
  let app;
  // check config
  if (!isConfigFileCreated()) {
    console.log('Starting setup mode...');
    var setup = require('./setup').setup;
    app = await setup();
  } else {
    var bootstrap = require('./bootstrap').bootstrap;
    app = await bootstrap();
  }
  await app.listen('3001');
};

function isConfigFileCreated() {
  return fs.existsSync('config.json');
}
