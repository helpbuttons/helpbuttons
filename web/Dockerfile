FROM node:16.17.1-alpine

RUN mkdir -p /app/ && chown -R node:node /app
WORKDIR /app

COPY --chown=node:node . /app/
RUN rm -f .env

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn
RUN yarn hb jwt
RUN yarn build

USER node

EXPOSE 3000
CMD [ "yarn", "start" ]