FROM node:12.16.2-alpine

ARG SSH_KEY

RUN mkdir -p /home/app
RUN apk add --no-cache openssh git g++ make

WORKDIR /home/app/

COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

EXPOSE 8080

CMD ["node", "dist/main.js"]
