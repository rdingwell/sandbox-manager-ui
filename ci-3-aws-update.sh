#!/usr/bin/env bash

apt-get update
apt-get install -y unzip python-pip libpython-dev
curl "https://s3.amazonaws.com/aws-cli/awscli-bundle.zip" -o "awscli-bundle.zip"
unzip awscli-bundle.zip
./awscli-bundle/install -b ~/bin/aws

set -e

echo "starting ci-3-aws-update.sh..."
export TASK_VERSION=$(/root/bin/aws ecs register-task-definition --family $1 --container-definitions $(cat container-definitions_test.json | jq -c '.')  | jq --raw-output '.taskDefinition.revision')
echo "TASK_VERSION: $TASK_VERSION"

echo "BITBUCKET_BRANCH: $BITBUCKET_BRANCH"
if [ ! -z "$BITBUCKET_BRANCH" ] && [ "$BITBUCKET_BRANCH" == "develop" ]
then
    [[ -z "$TARGET_AWS_CLUSTER" ]] && { echo "Error: TARGET_AWS_CLUSTER is not provided"; exit 1; } || echo "TARGET_AWS_CLUSTER: $TARGET_AWS_CLUSTER"
    [[ -z "$TARGET_AWS_SERVICE" ]] && { echo "Error: TARGET_AWS_SERVICE is not provided"; exit 1; } || echo "TARGET_AWS_SERVICE: $TARGET_AWS_SERVICE"

    echo "updating aws esc service..."
    /root/bin/aws ecs update-service --cluster $TARGET_AWS_CLUSTER --service $TARGET_AWS_SERVICE --task-definition $PROJECT_NAME:$TASK_VERSION
else
    echo "skipping deployment"
fi

echo "finished ci-3-aws-update.sh"
