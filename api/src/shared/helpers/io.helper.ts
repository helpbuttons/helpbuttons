export function writeFilePromise(fileName:string, data: Buffer | string):Promise<string> {
    return new Promise(function(ok, notOk) {
      const fs = require('fs');
      fs.writeFile(fileName,data, function(err, data) {
          if (err) {
            notOk(err)
          } else {
            ok(fileName)
          }
      })
    })
  }