FROM ubuntu:18.04
RUN mkdir -p /app
WORKDIR /app

RUN apt-get update
RUN apt-get install -y git

RUN which git
FROM node:10-alpine

RUN mkdir -p /app/node_modules && chown -R node:node /app

WORKDIR /app

RUN which node


COPY package*.json ./

RUN apk add --no-cache git

RUN git config --global http.sslVerify false

RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && yarn install \
    && apk del build-dependencies

COPY --chown=node:node . .

EXPOSE 8080

CMD [ "yarn", "start" ]
