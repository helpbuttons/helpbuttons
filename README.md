# How to start app in development mode

1. `cp .env.example .env` and update it with correct values
2. `npm run compose:up` to start Postgres container with PostGIS extension
4. `npm ci` and after this step wait for 3 second, This time should be enough for postgres initialize itself
6. `npm run start:dev`
