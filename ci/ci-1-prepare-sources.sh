#!/usr/bin/env bash

jq ".family = \"$PROJECT_FULL_NAME\"" ${TEMPLATE_FILE} > tmp.json && mv tmp.json ${TEMPLATE_FILE}
jq ".containerDefinitions[0].name = \"$PROJECT_FULL_NAME\"" ${TEMPLATE_FILE} > tmp.json && mv tmp.json ${TEMPLATE_FILE}
jq ".containerDefinitions[0].image = \"$DOCKER_IMAGE_COORDINATES\"" ${TEMPLATE_FILE} > tmp.json && mv tmp.json ${TEMPLATE_FILE}
jq ".containerDefinitions[0].portMappings[0].containerPort=(${PROJECT_PORT} | tonumber)" ${TEMPLATE_FILE} > tmp.json && mv tmp.json ${TEMPLATE_FILE}
jq ".containerDefinitions[0].logConfiguration.options.\"awslogs-group\" = \"/ecs/$PROJECT_FULL_NAME\"" ${TEMPLATE_FILE} > tmp.json && mv tmp.json ${TEMPLATE_FILE}
jq "(.containerDefinitions[0].environment[] | select(.name == \"JASYPT_ENCRYPTOR_PASSWORD\") | .value) |= \""${CREDENTIALS}"\"" ${TEMPLATE_FILE} > tmp.json && mv tmp.json ${TEMPLATE_FILE}
jq "(.containerDefinitions[0].environment[] | select(.name == \"SPRING_PROFILES_ACTIVE\") | .value) |= \"${SPRING_PROFILES_ACTIVE}\"" ${TEMPLATE_FILE} > tmp.json && mv tmp.json ${TEMPLATE_FILE}
jq "(.containerDefinitions[0].environment[] | select(.name == \"TARGET_ENV\") | .value) |= \"${TARGET_ENV}\"" ${TEMPLATE_FILE} > tmp.json && mv tmp.json ${TEMPLATE_FILE}
jq ".containerDefinitions[0].memoryReservation=(${AWS_CONTAINER_MEMORY_RESERVE} | tonumber)" ${TEMPLATE_FILE} > tmp.json && mv tmp.json ${TEMPLATE_FILE}

cat ${TEMPLATE_FILE}

echo "starting prepare_build.sh..."

#echo "Cloning the 'lib' repo"
#cd ../projects
#git clone git@bitbucket.org:hspconsortium/sandbox-manager-lib.git
#cd sandbox-manager-lib
#npm link
#cd ../../

echo "::: Running NPM INSTALL"
npm install
npm link sandbox-manager-lib

cd ci

echo "finished prepare_build.sh"
