

## Developers

### Develop web

You can run the api & database in docker you can do:

`$ docker-compose build db api`

`$ docker-compose up -d db api`

if the database you use is not in dev mode add your port to your docker-compose.yml:

`ports: - 5432:5432`

you might need to run also (if you never built the project before)

`$ cd api && yarn dev`

you need to generate a jwt key

`$ cd web && yarn hb jwt` (in the web folder)

also don't forget to run the migrations on the api

`$ yarn migration:run`

and then run the web with:

`$ cd web && yarn && yarn write-version && yarn dev`

you probably need to edit the .env file of web to point to the api:

`$ echo "API_URL=http://localhost:3001/" > web/.env`

### common errors

If you find this error with yarn dev in web directory

`Error: error:0308010C:digital envelope routines:: unsupported`

try this command and retry:

`export NODE_OPTIONS=--openssl-legacy-provider`

### develop api
You need a postgis database. postgres+opengis you can use our docker-compose file. You will need to 

`$ docker-compose up -d db`

run the api in watch mode:

`$ cd api && yarn && yarn dev`

run the web in watch mode:

`$ cd api && yarn && yarn web`

### developer-extras
you might need to run also (if you never built the project before)

`$ yarn write-version`

also don't forget to run the migrations on the api

`$ cd api yarn migration:run`

## Key Elements, Components and Layouts

To see a preview of all the styled key pieces that conform the app, open http://localhost:3000/RepositoryPage.

For available icons visit :

https://react-icons.github.io/react-icons/icons?name=bs

## Complete Documentation

Please load and read complete documentation
[hb-docs](https://github.com/helpbuttons/hb-docs)

