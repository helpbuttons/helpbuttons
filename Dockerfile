FROM node:16.17.1-alpine

RUN mkdir -p /app/ && chown -R node:node /app
WORKDIR /app
USER node

## API
COPY --chown=node:node api api/
RUN cd api &&\
    rm -f config.json &&\
    yarn &&\
    yarn build
    
EXPOSE 3001 
# CMD [ "yarn", "start" ]

## WEB
COPY --chown=node:node web web/

ENV NEXT_TELEMETRY_DISABLED 1
RUN cd web && \
    yarn &&\
    yarn build &&\
    rm .env &&\
    yarn hb jwt

EXPOSE 3000
# CMD [ "yarn", "start" ]
