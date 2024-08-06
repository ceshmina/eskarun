FROM node:20.16

WORKDIR /project
COPY package.json yarn.lock ./
RUN yarn install
