# Builds a Docker to deliver dist/
FROM sameersbn/nginx:1.10.3

COPY ./docker/includes/nginx/config /etc/nginx
COPY ./projects/sandbox-manager/build/www /usr/share/nginx/html/

# Install jq and qwscli
RUN apt-get update && apt-get install -y jq python-pip && pip install --upgrade pip && pip install awscli

RUN curl -o /usr/local/bin/ecs-cli https://s3.amazonaws.com/amazon-ecs-cli/ecs-cli-linux-amd64-latest && chmod +x /usr/local/bin/ecs-cli

#FROM node:alpine
#COPY . .
#ENV TARGET_ENV="test"
#RUN npm install
#CMD [ "npm", "run", "serve" ]
