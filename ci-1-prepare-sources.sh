#!/usr/bin/env bash

set -e

echo "starting prepare_build.sh..."

echo "::: Running NPM INSTALL"
npm install
echo "::: STARTING THE BUILD"
npm run sandbox-manager:build:dev

echo "finished prepare_build.sh"
