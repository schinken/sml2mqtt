FROM node:lts-alpine AS builder
WORKDIR /usr/src/app
COPY ./ /usr/src/app

RUN true \
    && apk add --no-cache python make g++ \
    && npm install

FROM node:lts-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
CMD ["npm", "start"]