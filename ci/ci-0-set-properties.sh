#!/usr/bin/env bash

curl -o /usr/local/bin/jq -L https://github.com/stedolan/jq/releases/download/jq-1.5/jq-linux64 && chmod +x /usr/local/bin/jq

export PROJECT_NAME="sandbox-manager"

export PROJECT_FULL_NAME="${PROJECT_NAME}-${TARGET_ENV}"

export PROJECT_VERSION=$(cat ../package.json | jq --raw-output '.version')

export PROJECT_PORT=$(cat ../package.json | jq --raw-output '.config.port')

export DOCKER_IMAGE_COORDINATES="hspconsortium/${PROJECT_NAME}:${PROJECT_VERSION}"

export SPRING_PROFILES_ACTIVE=""

export AWS_CONTAINER_MEMORY_RESERVE=$(cat ../package.json | jq --raw-output '.config.memory')

export TEMPLATE_FILE="../aws/task-definition.json"
