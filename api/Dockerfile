FROM node:16-bullseye-slim
WORKDIR /app

COPY . .

RUN rm -f config.json
RUN yarn
RUN yarn build

EXPOSE 3001 
CMD [ "yarn", "start" ]
