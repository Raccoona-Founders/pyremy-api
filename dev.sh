#!/bin/sh
export SERVICE_NAME='pyremy-api'

export MONGO_URL='mongodb://pyremy.jojum.com:27017'
export MONGO_USERNAME='user'
export MONGO_PASSWORD='password'

export REDIS_URL='redis://pyremy.jojum.com:6379'
export REDIS_PASSWORD='password'

yarn start:dev
