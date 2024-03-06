FROM node:16.17.1-alpine AS builder
WORKDIR /app
# install first what will probably never change
RUN apk add git

# copy only what you need to build node_modules
COPY package.json yarn.lock ./
RUN yarn

# copy code that changes a lot
COPY . .
RUN yarn build

FROM node:16.17.1-alpine AS runner
WORKDIR /app

COPY --from=builder /app/tsconfig.json ./
COPY --from=builder /app/tsconfig.build.json ./
COPY --from=builder /app/nest-cli.json ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 3001 
CMD [ "node", "dist/main" ]