FROM node:16.17.1-alpine as builder
ARG API_URL
ENV API_URL "http://api:3001/"
RUN mkdir -p /app/
WORKDIR /app


ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add git
COPY package.json /app/
COPY yarn.lock /app/
RUN yarn

COPY . /app/
RUN yarn build

FROM node:16.17.1-alpine as runner
ARG API_URL
ENV API_URL "http://api:3001/"
WORKDIR /app

COPY --from=builder /app/package.json .
COPY --from=builder /app/yarn.lock . 
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/public/ ./public
COPY --from=builder /app/.next/standalone/ ./
COPY --from=builder /app/.next/static/ ./.next/static

EXPOSE 3000
CMD [ "node", "server.js" ]