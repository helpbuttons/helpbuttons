## Contributing
If you would like to contribute to helpbuttons, we recommend that either you pick an issue in the github helpbuttons repository, or create a new issue, so that we can agree into adding this new feature or bugfix into the main code of helpbuttons. We recommend that you take a look at the issues labeled with [good first issue](https://github.com/helpbuttons/helpbuttons/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22)

After picking up your issue, you should known that we use git flow. So you should do a branch from the `dev`, and when you feel your code is ready push your branch and open a pull request to the `dev` branch.

The instance of helpbuttons runnning in https://dev.helpbuttons.org is up to date with the latest changes in the `dev` branch, the changes are automatically pulled.

## Requirements (recommended)
 - Docker >= 24.0.7
 - docker-compose >= 2.23.3
 - node >= v20.11.0
 - yarn >= 1.22.21 

## Contributing to frontend

copy the sample env file, and edit accordingly.

`$ cp env.sample .env`

generate jwt token:

`$ docker-compose run api yarn cli config:genjwt`

add the jwtSecret generated to the .env file

Edit the docker-compose.yml, so that the frontend has access to the api, by binding the port 3001
```
 ports: 
  - 3001:3001
```

and make sure api is in the external_network network by uncomenting the line on the networks of the api

` - external_network`

You can run the api & database in docker you can do:

`$ docker-compose up api`

run all the migrations / setup the database schema:

`$ docker-compose exec api yarn migration:run`

to run the ui in development mode, enter the frontend source folder

`$ cd web`

create an .env file with the address of the api and port

`echo "API_URL=http://localhost:3001/" > .env`

install all node_modules packages

`$ yarn`

run the app in watch mode

`$ yarn dev`

You can now browse to `http://localhost:3000` to configure helpbuttons!
## Contributing to the backend/api
You need a postgis database. postgres+opengis you can use our docker-compose file. You will need to put all containers down

`$ docker-compose down`

#### Setup database

You want to be able to access 5432 port from the db
```
 ports: 
  - 5432:5432
```

and make sure api is in the external_network network by uncomenting the line on the networks of the db

` - external_network`

run the database

`$ docker-compose up db`

#### Run the backend in development mode

create an .env 
`$ cp env.sample api/.env` (you can edit this file if you change your api host)

edit the file `api/.env` acoording to your needs, you will need to change the POSTGRES_HOSTNAME to `localhost`.

to run the api in watch mode you need firstly to go into the api folder

`$ cd api`

install all node_modules packages

`$ yarn`

run in watch/development mode

`$ yarn dev`

run all the migrations / setup the database schema:

`$ yarn migration:run`

You can now browse to `http://localhost:3000` to configure helpbuttons!

### Troubleshooting

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


## guide to add a new attribute in a network

go to api/src/modules/network

add the new attr to 
 - network.entity.ts (this is to define in the db)
 - network.dto.ts (this is for the post request to validate)

run `$ yarn migration:generate src/data/migrations/name`

run `$ yarn migration:run`

in the frontend:
web/src/pages/Configuration/index.tsx

add the attr to the submit field
