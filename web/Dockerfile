FROM node:16.17.1-alpine

RUN mkdir -p /app/
WORKDIR /app

COPY . /app/

ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add git

RUN yarn
RUN yarn hb jwt
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]