FROM node:16.17.1-alpine
WORKDIR /app
# install first what will probably never change
RUN apk add git

# copy only what you need to build node_modules
COPY package.json yarn.lock ./
RUN yarn

# copy code that changes a lot
COPY api/ /app/api
RUN yarn build

# EXPOSE 3001 
# CMD [ "node", "dist/main" ]

# FROM node:16.17.1-alpine

# ARG API_URL
# ENV API_URL "http://api:3001"

# RUN mkdir -p /app/
# WORKDIR /app

# COPY . /app/

# ENV NEXT_TELEMETRY_DISABLED 1

# RUN apk add git

# RUN yarn
# RUN yarn build

# EXPOSE 3000
# CMD [ "yarn", "start" ]