# Helpbuttons

> Build your own collaboration app in seconds.

![HB cover](/web/public/assets/images/hb_landscape_02_small.jpg?raw=true)

Helpbuttons helps you build collaborative tools for any activity — sharing transport, seizing food, mutual support, neighborhood communities, schools, town halls, or emergency teams. It connects people with specific needs to create networks under total control of their community.

---

## Features

Open your own social network for cooperation
![cover](https://wofreedom.org/wp-content/uploads/sites/8/2026/03/Captura-de-Pantalla-2026-03-26-a-las-19.40.06-scaled.jpg)

Customize your look and configure your needs
![cover2](https://wofreedom.org/wp-content/uploads/sites/8/2026/03/Captura-de-Pantalla-2026-03-26-a-las-19.39.55-scaled.jpg)

Search by location, concept, or date to cooperate
![cover3](https://wofreedom.org/wp-content/uploads/sites/8/2026/03/Captura-de-Pantalla-2026-03-26-a-las-19.38.50-scaled.jpg)

Connect and manage messages
![cover4](https://wofreedom.org/wp-content/uploads/sites/8/2026/03/Captura-de-Pantalla-2026-03-26-a-las-19.39.46-scaled.jpg)

---

## Getting Started

### Requirements

- Docker & Docker Compose

### Installation

- For a complete guide on how to install Helpbuttons in your own server, follow this link: [New server Install](https://cloud.wofreedom.org/s/wae8FPenaK8MeTD)

1. Copy the environment sample file:
   ```bash
   cp env.sample .env
   ```

2. Edit `.env` according to your needs.

3. Generate a JWT secret:
   ```bash
   docker-compose run api yarn cli config:genjwt
   ```
   Add the generated `jwtSecret` to your `.env` file.

4. Start the stack:
   ```bash
   docker-compose up
   ```

5. Run database migrations:
   ```bash
   docker-compose run api yarn migration:run
   ```

6. Open the app at **http://localhost:3000**

### Upgrade

```bash
docker-compose pull
docker-compose run api yarn migration:run
```

---

## Tech Stack

| Layer    | Technologies                          |
|----------|---------------------------------------|
| Frontend | TypeScript, React, Next.js, Leaflet   |
| Backend  | TypeScript, NestJS, TypeORM           |
| Database | PostgreSQL                            |

---

## Documentation

- [Contributing guide](CONTRIBUTING.md)
- [Extended documentation](https://github.com/helpbuttons/hb-docs)
- [Next.js docs](https://nextjs.org/docs)
- [NestJS docs](https://docs.nestjs.com)
- [react-icons (io5)](https://react-icons.github.io/react-icons/icons/io5/)
- [Helpbuttons Concept Presentation](https://www.dropbox.com/scl/fi/9mttow7agj9f6zmg8dawd/2026_helputtons_concepto_00.pdf?rlkey=xucp3zf2m2tnbjroaobxns63v&e=1&dl=1)

---

## Troubleshooting

**Access the database inside Docker:**
```bash
docker-compose exec db psql -U [USER] [DATABASE_NAME]
```

**Reset the database** (when the backend fails to start due to DB issues):
Remove the `db` directory and restart.

**Drop schema and start fresh:**
```bash
yarn schema:drop
# or
docker-compose exec api yarn schema:drop
```

---

## Community

<a rel="me" href="https://fosstodon.org/@helpbuttonsorg"><img src="https://static.fsf.org/nosvn/images/socials/mastodon.png" width="36"></a>
&nbsp;
<a href="https://t.me/+ls0xkQlG8uBlZjZk"><img src="https://lh3.googleusercontent.com/jVXglyWWL5J2y1vRN-7Jy3_ozvvZc4w5486IAkbAIrWcNN_vn7YuIvhc1JDtGq43BqGl=s180" width="36"></a>

Contact: help _at_ helpbuttons.org
