# Check out https://hub.docker.com/_/node to select a new base image
FROM node:16.9.1-slim
ENV DEBIAN_FRONTEND noninteractive

RUN apt update && echo "la"
RUN apt -y install git

RUN npm install -g npm

# Set to a non-root built-in user `node`
USER node

# Create app directory (with user `node`)
RUN mkdir -p /home/node/app

WORKDIR /home/node/app

# RUN git clone https://github.com/helpbuttons/hb-back.git `pwd`
COPY . /home/node/app

RUN yarn

# Bundle app source code
COPY --chown=node . .

RUN yarn build

# Bind to all network interfaces so that it can be mapped to the host OS
ENV HOST=0.0.0.0 PORT=3001

EXPOSE ${PORT}
CMD [ "node", "." ]
