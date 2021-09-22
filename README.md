# helpbuttons backend


## run with npm
### install dependencies

```sh
npm install
```
#### Setup using postgres as datastore
##### Setup postgres
To drop all tables, recreate all schema, and run migrations
```sh
$ npm run postgres:reset
```

#### start postgres
Start postgres
```sh
$ npm run postgres:start
```

#### Run the application
```sh
$ npm start
```

Open http://127.0.0.1:3001 in your browser.

#### run the application in watchmode 
```sh
$ npm start:watch
```

### Setup using memory (json file) as datastore 
 - If you use memory you won't be able to run postgres+GIS queries )
#### Setup memory
```sh
$ NODE_ENV=memory npm run migrate
```

#### Run the application
```sh
$ NODE_ENV=memory npm start
```


## developers hints:

Cheatsheet on chai and mochajs 
 https://devhints.io/chai.html
