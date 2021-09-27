# helpbuttons backend

## run using docker-compose

### copy & edit the file env.docker to .env according to your needs
`$ cp env.docker .env`

### put the backend up and running
`$ docker-compose up`

Open http://127.0.0.1:3001 in your browser.

## run with yarn
### install dependencies

```sh
yarn
```

#### Setup using postgres as datastore
#### start postgres
Start postgres
```sh
$ yarn postgres:start
```

#### Run the application
```sh
$ yarn start
```

Open http://127.0.0.1:3001 in your browser.

#### run the application in watchmode 
```sh
$ yarn start:watch
```

### Setup using memory (json file) as datastore 
 - If you use memory you won't be able to run postgres+GIS queries )
#### Setup memory
```sh
$ NODE_ENV=memory yarn run migrate
```

#### Run the application
```sh
$ NODE_ENV=memory yarn start
```


## developers hints:

Cheatsheet on chai and mochajs 
 https://devhints.io/chai.html
