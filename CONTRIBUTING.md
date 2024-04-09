

## Developers

### Develop web

copy the sample env file, and edit accordingly.

`$ cp env.sample .env`

generate jwt token:

`$ docker-compose run api yarn cli config:genjwt`

add the jwtSecret generated to the .env file

You can run the api & database in docker you can do:

`$ docker-compose up api`

You want to be able to access 3001 port from the api
```
 ports: 
  - 3001:3001
```

and make sure api is in the external_network network by uncomenting the line on the networks of the api

` - external_network`

to run the ui in development mode

first enter the nextjs project folder

`$ cd web`

create an .env file with the address of the api and port

`echo "API_URL=http://localhost:3001/" > .env`

install all node_modules packages

`$ yarn`

run the app in watch mode

`$ yarn dev`

run migrations:

`$ docker-compose exec api yarn migration:run`

### develop api
You need a postgis database. postgres+opengis you can use our docker-compose file. You will need to 

put all containers down

`$ docker-compose down`

create an .env 
`$ cp env.sample api/.env` (you can edit this file if you change your api host)

edit the file `api/.env` acoording to ur needs

run the database

`$ docker-compose up -d db`

You want to be able to access 5432 port from the db
```
 ports: 
  - 5432:5432
```


and make sure api is in the external_network network by uncomenting the line on the networks of the db

` - external_network`

run the api in watch mode:

enter the nestjs project folder

`$ cd api`

install all node_modules packages

`$ yarn`

generate jwt key

`$ yarn build`

`$ yarn cli config:genjwt`


run in watch/development mode

`$ yarn dev`

run the migrations

`$ yarn migration:run`

(follow the instructions of the web on top of this file, to run the ui)

### common errors

If you find this error with yarn dev in web directory

`Error: error:0308010C:digital envelope routines:: unsupported`

try this command and retry:

`export NODE_OPTIONS=--openssl-legacy-provider`

## Key Elements, Components and Layouts

To see a preview of all the styled key pieces that conform the app, open http://localhost:3000/RepositoryPage.

For available icons visit :

https://react-icons.github.io/react-icons/icons?name=bs

## Complete Documentation

Please load and read complete documentation
[hb-docs](https://github.com/helpbuttons/hb-docs)


## guide to build a new attribute in a network

go to api/src/modules/network

add the new attr to 
 - network.entity.ts (this is to define in the db)
 - network.dto.ts (this is for the post request to validate)

run `yarn migration:generate src/data/migrations/name`

run `yarn migration:run`

in the frontend:
web/src/pages/Configuration/index.tsx

add the attr to the submit field
