import cryptoRandomString from 'crypto-random-string';

const process = require('process');
require('dotenv').config();

var args = process.argv;
// generate jwt
// set api url
//
// args.forEach((val) => {
switch (args[2]) {
  case 'jwt': {
    const token = cryptoRandomString({
      length: 40,
      type: 'alphanumeric',
    });
    replaceEnvValue('JWT_TOKEN',token);
    break;
  }
  case 'api_url': {
    replaceEnvValue('API_URL',args[3]);
    break;
  }
  default: {
    console.log('gimme help');
  }
}

async function replaceEnvValue(envVar:string, value: string) {
  

  return readFilePromise('.env')
  .then((data: string) => {
    const envString = `${envVar}="${value}"`;
    console.log(`Setting to ${envString}`)
    let regex = new RegExp(/NADA=.*/gm);
    switch(envVar){
      case "JWT_TOKEN":
        regex = new RegExp(/JWT_TOKEN=.*/gm);
        break;
      case "API_URL":
        regex = new RegExp(/API_URL=.*/gm);
        break;
      default:
        throw Error('we dont have that option!')
        break;
    }
    if(data.match(regex)) {
        data = data.replace(regex, envString); 
    }else {
        data =  `${data}\n${envString}`;
    }

    return writeFilePromise( '.env',data);

  }).catch((error) => {
    console.log(error);
  });

}



function readFilePromise(file) :Promise<string>{
  return new Promise(function(ok, notOk) {
    const fs = require('fs');
    fs.readFile(file, 'utf8',function(err, data) {
        if (err) {
            if(err?.errno === -2) {
                ok('');
            }
          notOk(err)
        } else {
          ok(data)
        }
    })
  })
}

function writeFilePromise(file, data: string) {
    return new Promise(function(ok, notOk) {
      const fs = require('fs');
      fs.writeFile(file,data, function(err, data) {
          if (err) {
            notOk(err)
          } else {
            ok(data)
          }
      })
    })
  }