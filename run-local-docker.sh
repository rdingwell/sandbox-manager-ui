#!/usr/bin/env bash

echo "Cloning the 'lib' repo"
cd ./projects
git clone git@bitbucket.org:hspconsortium/sandbox-manager-lib.git
cd sandbox-manager-lib
npm link
cd ..

echo "::: Running NPM INSTALL"
npm install
npm link sandbox-manager-lib

npm run sandbox-manager:build:local

cd ..
docker build --build-arg TARGET_ENV=local -t sandbox-manager-v3/node-web-app -f ./Dockerfile .
docker run -p 3001:3000 sandbox-manager-v3/node-web-app