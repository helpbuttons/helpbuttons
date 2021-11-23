# helpbuttons backend

## runing using docker-compose

### copy & edit the file env.docker to .env according to your needs
`$ cp env.docker .env`

### put the backend up and running
`$ docker-compose up`

Open http://127.0.0.1:3001 in your browser.

## runing with yarn
#### We need to run an instance of postgis.. we recomend to use docker 

To start postgis:
```sh
$ docker-compose up db
```

### copy the .env file and edit according to ur needs

> In the env file u can define an smtp host, and also where postgis is running

```sh
cp env.docker .env
nano .env
```

### install dependencies

```sh
yarn
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



## developers hints:

Cheatsheet on chai and mochajs 
 https://devhints.io/chai.html
