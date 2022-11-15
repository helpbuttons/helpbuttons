FROM node:16.17.1-alpine

RUN mkdir -p /app/ && chown -R node:node /app
WORKDIR /app
COPY --chown=node:node . .

USER node

RUN yarn
RUN yarn build
ENV NEXT_TELEMETRY_DISABLED 1

EXPOSE 3000
CMD [ "yarn", "start" ]
