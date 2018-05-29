#!/usr/bin/env bash

echo "::: STARTING THE BUILD"

npm run sandbox-manager:build:${TARGET_ENV}

echo "::: BUILD ENDED"
