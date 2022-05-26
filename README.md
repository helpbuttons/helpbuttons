![HB cover](https://github.com/helpbuttons/hb-front/raw/develop/public/assets/images/hb_landscape_02_small.jpg?raw=true "hb cover")

# Welcome to Helpbuttons' backend Repository

This is the backend repository for Helpbuttons. In order to comunicate with this backend (API) you need to install [hb-front](https://github.com/helpbuttons/hb-front) too. For more detailed info check the hb-docs repo (https://github.com/helpbuttons/hb-docs).

This software is currently being developed heavily, so be minded this might not work, but you are welcome to [contribute](CONTRIBUTING.md)

## Getting Started

### First, run the postgis server using docker: 

`$ docker-compose up -d db`

### Second, setup the .env file:

`$ cp .env.example .env`

edit the .env file according to your needs.

### Lastly, run the backend:
```
$ npm ci

$ npm run start:dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Main tech specifications used in this repo:

Typescript, NestJS, TypeORM

## Learn More


This is a [nestjs](https://nestjs.com/)

To learn more about nestjs, take a look at the following resources:

- [Nestjs Documentation](https://docs.nestjs.com/) - learn about nestjs features.

You can check out [the nestjs GitHub repository](https://github.com/nestjs/nest) - your feedback and contributions are welcome!


## Troubleshooting

- Accessing the database to docker:

`$ docker-compose exec db psql -U [USER] [DATABASE_NAME]`

- When the backend fails to start because of database problems, you can always reset the database, by removing the directory `db`
