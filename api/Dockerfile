FROM node:16-bullseye-slim
WORKDIR /app

COPY --chown=node:node . /app/
RUN chown node:node /app/node_modules

RUN yarn
RUN yarn build

USER node 

EXPOSE 3001 
CMD [ "yarn", "start" ]