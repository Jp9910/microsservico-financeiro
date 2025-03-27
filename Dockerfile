# https://www.digitalocean.com/community/tutorials/how-to-build-a-node-js-application-with-docker#step-3-writing-the-dockerfile
FROM node:20-alpine
USER node
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app

# copy host's current folder to container's current workdir, setting file ownership
# o docker vai ignorar as pastas definidas no .dockerignore
COPY --chown=node:node ./ ./

EXPOSE 3001
ENTRYPOINT [ "/bin/sh", "-c" ]
