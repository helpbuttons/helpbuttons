FROM node:16-bullseye-slim
WORKDIR /app

USER node 
COPY --chown=node:node . .

COPY . .

RUN rm -f config.json
RUN yarn
RUN yarn build

COPY --chown=node:node . .

EXPOSE 3001 
CMD [ "yarn", "start" ]
