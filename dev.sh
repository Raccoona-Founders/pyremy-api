#!/bin/sh
export SERVICE_NAME='pyremy-api'

export MONGO_URL='mongodb://pyremy.jojum.com:27017'
export MONGO_USERNAME='raccoona'
export MONGO_PASSWORD='A892sei3'

export REDIS_URL='redis://localhost:6379'

export PYREMY_URL='http://pyremy.jojum.com:8081'

yarn start:dev
