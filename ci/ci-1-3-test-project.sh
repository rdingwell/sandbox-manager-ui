#!/usr/bin/env bash
cd ../
echo "Starting the server in test mode"
npm run smt &
sleep 30s
echo "Running the tests"
npm run test
