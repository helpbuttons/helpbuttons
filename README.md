# helpbuttons backend


## run with npm
### install dependencies

```sh
npm install
```
### setup the datasources

#### Memory
```sh
npm run migrate
```

#### Postgres
To drop all tables, recreate all schema, and run migrations
```sh
$ docker-compose exec postgres /migrations/run_all.sh drop
```

### Run the application
```sh
npm start
```

Open http://127.0.0.1:3001 in your browser.

### run the application in watchmode
```sh
npm start:watch
```

## run with docker
 TODO

## developers hints:

Cheatsheet on chai and mochajs 
 https://devhints.io/chai.html
