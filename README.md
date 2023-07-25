![HB cover](/web/public/assets/images/hb_landscape_02_small.jpg?raw=true "hb cover")

helpbuttons is a one-on-one social collaboration app with no money exchange. Find volunteers, share, help and get recognition for your action in a simple way. We need people. If you believe in social collaboration beyond consumption.

This software helps build collaborative tools for any activity, such as sharing transport or seizing food. It connects people with specific needs to create networks. Mutual support groups, neighborhood communities, schools, town halls or emergency teams will benefit from it.

[<img src="https://static.fsf.org/nosvn/images/socials/mastodon.png" width="48">
](https://fosstodon.org/@helpbuttonsorg)
[<img src="https://lh3.googleusercontent.com/-DE6obBjEEko/YJ_w7v1-0WI/AAAAAAAAI1c/LVh2thnkuk88FBGAbm0hpuzHSXZcwGjaACLcBGAsYHQ/image.png" width="48">
](https://t.me/+ls0xkQlG8uBlZjZk)
[<img src="https://apkbolt.com/wp-content/uploads/2018/08/Discord-Apk.png" width="48">
](https://discord.gg/UBKWHuj2Vn)

<a rel="me" href="https://fosstodon.org/@helpbuttonsorg">Mastodon</a>

contact us: helpbuttons _at_ tutanota.com
# Welcome to Helpbuttons Repository

This is the repository for helpbuttons.org. check the hb-docs repo (https://github.com/helpbuttons/hb-docs).
## Getting Started

### Using docker

Copy the docker-compose.yml to the folder where you want to work.

Edit the part of the docker-compose.yml to setup the credentials of the database, where it says:

```
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=CHANGE_ME
      - POSTGRES_DB=hb-db
```

lets put it all up

`$ docker-compose up -d`

Open the browser on **http://host:3000**

setup the database according to what you setup in env.db and get an [opencage](https://opencagedata.com/) api key

then please setup the database scheme:

`$ docker-compose run api yarn migration:run`

#### Upgrade

`$ docker-compose pull`

`$ docker-compose run api yarn migration:run`

### Main tech specifications used in this repo:

Typescript, React, NextJS, Leaflet, CSS, HTML

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

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

