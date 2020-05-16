#!/usr/bin/env bash

NODE_ENV=production
APP_ENV=production

##### Constants
APPLICATION_VERSION=$(jq -r ".version" package.json)
WITH_PUSH=0
SSH_KEY=$(cat ~/.ssh/p1k)


for arg in "$@"
do
  case $arg in
    --push*)
      WITH_PUSH=1
      shift
      ;;

    --version=*)
      APPLICATION_VERSION="${arg#*=}"
      shift
      ;;

    --ssh-key=*)
      SSH_KEY="${arg#*=}"
      shift
      ;;
  esac
done


build_docker()
{
    docker build \
        --file ./Dockerfile \
        --build-arg SSH_KEY="$SSH_KEY" \
        --tag coinwizard/pyremy-api:$APPLICATION_VERSION \
        --tag coinwizard/pyremy-api:latest \
        --tag coinwizard/pyremy-api .

    # end of build_docker
}


push_docker()
{
    docker login -u "$CI_REGISTRY_USER" -p "$CI_REGISTRY_PASSWORD" $CI_REGISTRY

    docker push coinwizard/pyremy-api:$APPLICATION_VERSION
    docker push coinwizard/pyremy-api:latest
    # end of push_docker
}

echo " ========= Start building ========= "
build_docker


if [[ $WITH_PUSH = "1" ]]
then
    echo " ========= Start pushing ========= "
    push_docker
fi
