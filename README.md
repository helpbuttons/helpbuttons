For developers, open [CONTRIBUTING.md](/CONTRIBUTING.md) 

![HB cover](/web/public/assets/images/hb_landscape_02_small.jpg?raw=true "hb cover")

¡Build your own collaboration app in seconds with Helpbuttons! 

This software helps you to build collaborative tools for any activity, such as sharing transport or seizing food. It connects people with specific needs to create networks. Mutual support groups, neighborhood communities, schools, town halls or emergency teams would be great benefit from it.

We're currently testing real life examples that you can check in our website. Specially we're aiming to maximize accesibility and develop modules that allow more use cases. Check those tags if you want to help us in those fields.

You can install your own tool in your server with this repo or ask us for help and host it at <a rel="me" href="https://helpbuttons.org">helputtons.org</a>

We accept donations: 

[USD/EUR](https://buy.stripe.com/9AQ5kl3CYaIvgRW6ou)


![UX view](https://watchoutfreedom.com/wp-content/uploads/2024/03/Captura-de-Pantalla-2024-03-13-a-las-21.30.09-2048x1124.jpg "UX view")



[<img src="https://static.fsf.org/nosvn/images/socials/mastodon.png" width="48">
](https://fosstodon.org/@helpbuttonsorg)
[<img src="https://lh3.googleusercontent.com/-DE6obBjEEko/YJ_w7v1-0WI/AAAAAAAAI1c/LVh2thnkuk88FBGAbm0hpuzHSXZcwGjaACLcBGAsYHQ/image.png" width="48">
](https://t.me/+ls0xkQlG8uBlZjZk)
[<img src="https://apkbolt.com/wp-content/uploads/2018/08/Discord-Apk.png" width="48">
](https://discord.gg/UBKWHuj2Vn)

<a rel="me" href="https://fosstodon.org/@helpbuttonsorg">Mastodon</a>

contact us: help _at_ helpbuttons.org
# Welcome to Helpbuttons Repository

This is the repository for helpbuttons.org. check more documentations at the repo (https://github.com/helpbuttons/hb-docs).

## Getting Started

### Using docker

copy the env.sample file:
`$ cp env.sample .env`

edit the `.env` file according to your needs

generate jwt token:

`$ docker-compose run api yarn cli config:genjwt`

add the jwtSecret generated to the .env file

lets put it all up

`$ docker-compose up`

Open the browser on **http://host:3000**

run all the migrations / setup the database schema:

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

- checkout the list of available icons from [react-icons](https://react-icons.github.io/react-icons/icons/io5/)
You can check out [the nestjs GitHub repository](https://github.com/nestjs/nest) - your feedback and contributions are welcome!


#### Troubleshooting the api

- Accessing the database to docker:

`$ docker-compose exec db psql -U [USER] [DATABASE_NAME]`

- When the backend fails to start because of database problems, you can always reset the database, by removing the directory `db`

- If you need to drop the scheme and restart fresh you run
`$ yarn schema:drop` or `$ docker-compose exec api yarn schema:drop`

