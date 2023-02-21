FROM node:16.17.1-alpine
WORKDIR /app

COPY . /app/

RUN yarn
RUN yarn build

EXPOSE 3001 
CMD [ "yarn", "start" ]