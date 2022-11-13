FROM node:16-bullseye-slim
WORKDIR /app

COPY package.json package.json
RUN npm i

COPY . .
#RUN npm run build 

EXPOSE 3001 
#CMD [ "npm", "run", "start" ]
CMD [ "tail", "-f", "/var/log/*"]
