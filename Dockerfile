FROM node:alpine

COPY . .
ARG ACTIVE_ENV
ENV ACTIVE_ENV=$ACTIVE_ENV
RUN if [ "$ACTIVE_ENV" = "prod" ]; then rm /src/assets/config/sandbox-manager.json; mv /src/assets/config/sandbox-manager_prod.json /src/assets/config/sandbox-manager.json; elif [ "$ACTIVE_ENV" = "test" ]; then rm /src/assets/config/sandbox-manager.json; mv /src/assets/config/sandbox-manager_test.json /src/assets/config/sandbox-manager.json; fi
#RUN if [ "$ACTIVE_ENV" = "prod" ]; then rm /src/.well-known/smart/manifest.json; mv /src/.well-known/smart/manifest.prod.json /src/.well-known/smart/manifest.json; elif [ "$ACTIVE_ENV" = "test" ]; then rm /src/.well-known/smart/manifest.json; mv /src/.well-known/smart/manifest.test.json /src/.well-known/smart/manifest.json; fi
RUN npm install
CMD [ "npm", "start" ]