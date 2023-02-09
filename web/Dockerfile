FROM node:16.17.1-alpine

RUN mkdir -p /app/ && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node . .
RUN rm -f .env

USER node

ENV NEXT_TELEMETRY_DISABLED 1
COPY --chown=node:node . .

RUN yarn
RUN yarn hb jwt

COPY --chown=node:node . .

EXPOSE 3000
CMD [ "yarn", "build", "&&", "yarn", "start" ]
