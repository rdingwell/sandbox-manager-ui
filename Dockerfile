# Builds a Docker to deliver dist/
FROM sameersbn/nginx:1.10.3

COPY ./docker/includes/nginx/config /etc/nginx
COPY ./projects/sandbox-manager/build/www /usr/share/nginx/html/

#FROM node:alpine
#COPY . .
#ENV TARGET_ENV="test"
#RUN npm install
#CMD [ "npm", "run", "sm" ]
