#!/usr/bin/env bash

cat ${TEMPLATE_FILE}
echo $(aws ecs register-task-definition --region us-west-2 --family ${PROJECT_FULL_NAME} --cli-input-json file://${TEMPLATE_FILE})
