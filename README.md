![HB cover](/web/public/assets/images/hb_landscape_02_small.jpg?raw=true "hb cover")

helpbuttons is a one-on-one social collaboration app with no money exchange. Find volunteers, share, help and get recognition for your action in a simple way. We need people. If you believe in social collaboration beyond consumption.

This software helps build collaborative tools for any activity, such as sharing transport or seizing food. It connects people with specific needs to create networks. Mutual support groups, neighborhood communities, schools, town halls or emergency teams will benefit from it.

[<img src="https://static.fsf.org/nosvn/images/socials/mastodon.png" width="48">
](https://fosstodon.org/@helpbuttonsorg)

# Welcome to Helpbuttons Repository

This is the repository for helpbuttons.org. check the hb-docs repo (https://github.com/helpbuttons/hb-docs).
## Getting Started

Edit the file db.env to setup your default values for configuration of the database
`$ nano env.db`

build all docker needed images
`$ docker-compose build`

then run helpbuttons
`$ docker-compose up -d`

then please setup the database scheme:
`$ docker-compose exec api yarn migration:run`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## For developers:
you can setup the url of the api
`$ docker-compose exec web yarn hb api_url http://localhost:3001/`


## Key Elements, Components and Layouts

To see a preview of all the styled key pieces that conform the app, open http://localhost:3000/RepositoryPage.

For available icons visit :

https://react-icons.github.io/react-icons/icons?name=bs

## Complete Documentation

Please load and read complete documentation
[hb-docs](https://github.com/helpbuttons/hb-docs)


## For developers:

### web

#### development
```
$ ln -s .env web/.env
$ docker-compose up -d api
$ docker-compose exec api yarn migration:run
$ cd web
$ yarn
$ yarn dev
```

#### Main tech specifications used in this repo:

Typescript, React, NextJS, Leaflet, CSS, HTML

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### API
#### development
```
$ ln -s .env api/.env
$ docker-compose up -d db
```
Uncoment on docker-compose the lines 
```
    # ports:
    #   - "5432:5432"
```

```
$ yarn migration:run
$ cd api
$ yarn
$ yarn dev
```


#### Main tech specifications used in this repo:

Typescript, NestJS, TypeORM

This is a [nestjs](https://nestjs.com/) project

To learn more about nestjs, take a look at the following resources:

- [Nestjs Documentation](https://docs.nestjs.com/) - learn about nestjs features.

You can check out [the nestjs GitHub repository](https://github.com/nestjs/nest) - your feedback and contributions are welcome!


#### Troubleshooting the api

- Accessing the database to docker:

`$ docker-compose exec db psql -U [USER] [DATABASE_NAME]`

- When the backend fails to start because of database problems, you can always reset the database, by removing the directory `db`

- If you need to drop the scheme and restart fresh you run
`$ yarn schema:drop` or `$ docker-compose exec api yarn schema:drop`