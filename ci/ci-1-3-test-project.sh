#!/usr/bin/env bash
cd ../
echo "Starting the server in test mode"
npm run smt &
echo "Process to kill:"
toKill = $!
echo toKill
sleep 50s
echo "Running the tests"
npm run test
#kill -9 $toKill
