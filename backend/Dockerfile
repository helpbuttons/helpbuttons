FROM node:16-bullseye-slim
WORKDIR /app

COPY package.json package.json
RUN yarn
 
COPY . .
RUN yarn build

EXPOSE 3001 
CMD [ "yarn", "start" ]
