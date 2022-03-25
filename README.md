# helpbuttons backend

## running the backend
#### We need to run an instance of postgis.. we recomend to use docker 

To start postgis:
```sh
$ cp env.docker .env
$ docker-compose up db -d
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
