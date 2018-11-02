#!/usr/bin/env bash

echo "starting sandbox manager..."
npm install
cd projects
git clone git@bitbucket.org:hspconsortium/sandbox-manager-lib.git
cd sandbox-manager-lib
npm link
cd ../../
npm link sandbox-manager-lib
npm run sandbox-manager:build:local
npm run sm