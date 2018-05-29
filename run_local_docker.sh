#!/usr/bin/env bash

docker build  -t sandbox-manager-prototype/node-web-app .
docker run -p 3000:3000 sandbox-manager-prototype/node-web-app