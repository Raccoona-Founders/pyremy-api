#!/bin/sh
export SERVICE_NAME='pyremy-api'
export MONGO_URL='mongodb://mongodb:27017/raccoona'
export MONGO_USERNAME='raccoona'
export MONGO_PASSWORD='raccoona'
export REDIS_URL='redis://redis:6379'
# export REDIS_PASSWORD='raccoona'

yarn start:dev
