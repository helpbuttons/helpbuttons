FROM node:16.17.1-alpine
WORKDIR /app
# install first what will probably never change
RUN apk add git

# copy only what you need to build node_modules
COPY package.json yarn.lock ./
RUN yarn

# copy code that changes a lot
COPY . .
RUN yarn build

EXPOSE 3001 
CMD [ "node", "dist/main" ]