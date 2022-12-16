FROM node:16.17.1-alpine

RUN mkdir -p /app/ && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node . .

USER node

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn
RUN yarn build
RUN rm .env
RUN yarn hb jwt

EXPOSE 3000
CMD [ "yarn", "start" ]
