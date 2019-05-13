#!/usr/bin/env bash

export PROJECT_NAME="sandbox-manager-prototype"

export PROJECT_FULL_NAME="${PROJECT_NAME}-${TARGET_ENV}"

export PROJECT_VERSION=$(cat ../package.json | jq --raw-output '.version')

export PROJECT_PORT=$(cat ../package.json | jq --raw-output '.config.port')

export DOCKER_IMAGE_COORDINATES="hspconsortium/${PROJECT_NAME}:${PROJECT_VERSION}"

export SPRING_PROFILES_ACTIVE=""

export AWS_CONTAINER_MEMORY_RESERVE=$(cat ../package.json | jq --raw-output '.config.memory')

export TEMPLATE_FILE="../aws/task-definition_${TARGET_ENV}.json"

export FIREFOX_VERSION="45.0"

export FIREFOX_DIR="/usr/bin/firefox"

export FIREFOX_FILENAME="$FIREFOX_DIR/firefox.tar.bz2"
