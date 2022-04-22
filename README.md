# How to start app in development mode

1. `cp .env.example .env` and update it with correct values
2. `cp .postgresql.env.example .postgresql.env` and update its values if you like
3. `npm run compose:up` to start Postgres container with PostGIS extension
4. `npm ci` and after this step wait for 3 second, This time should be enough for postgres initialize itself
5. `npm run prisma:dev`
6. `npm run start:dev`
