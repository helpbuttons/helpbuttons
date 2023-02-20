FROM node:16.17.1-alpine

RUN mkdir -p /app/ && chown -R node:node /app
WORKDIR /app

COPY --chown=node:node . /app/
RUN rm -f .env

USER node

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn
RUN yarn hb jwt
RUN yarn build

EXPOSE 3000
CMD [ "yarn", "start" ]
