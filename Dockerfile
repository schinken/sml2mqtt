FROM node:alpine AS builder
WORKDIR /usr/src/app
COPY ./ /usr/src/app

RUN true \
    && apk add --no-cache make gcc g++ python linux-headers udev \
    && npm install

FROM node:alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app .
CMD ["npm", "start"]