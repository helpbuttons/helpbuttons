FROM node:16-bullseye-slim
WORKDIR /app

COPY . .

RUN yarn
RUN yarn build

EXPOSE 3001 
CMD [ "yarn", "start" ]
