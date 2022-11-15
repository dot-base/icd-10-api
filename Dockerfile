FROM node:18.12.1-alpine AS builder
WORKDIR /usr/src/app
COPY . .
RUN npm install && \
    npm run build && \
    mkdir -p /usr/src/app-build && \
    mv ./build /usr/src/app-build/build && \
    mv ./tsconfig.production.json /usr/src/app-build/tsconfig.json && \
    mv ./package.json /usr/src/app-build/package.json
WORKDIR /usr/src/app-build
RUN npm install --omit=dev

FROM node:18.12.1-alpine
RUN apk add dumb-init
ENV NODE_ENV production
WORKDIR /usr/src/app
COPY --from=builder --chown=node:node /usr/src/app-build .
USER node
CMD ["dumb-init", "node", "-r", "tsconfig-paths/register", "build/server.js"]
