#https://github.com/devillexio/docker-firebase/blob/master/Dockerfile
# use latest Node LTS (currently Dubnium)
FROM node:dubnium

# set user to avoid permission issues
# (see https://github.com/nodejs/node-gyp/issues/1236)
USER node
RUN mkdir /home/node/.npm-global
ENV PATH=/home/node/.npm-global/bin:$PATH
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global

# install Firebase CLI
RUN npm i -g firebase-tools

# reset user back to root
USER root