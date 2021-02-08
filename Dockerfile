FROM node:14
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan bitbucket.org >> ~/.ssh/known_hosts
RUN git config --global url.ssh://git@bitbucket.org.insteadof https://bitbucket.org
ARG NODE_MODULES=src/node_modules
COPY $NODE_MODULES .
RUN --mount=type=ssh npm i
COPY ./src ./src
COPY ./tsconfig.json .
COPY ./webpack.config.js .
COPY ./webpack.prod.config.js .
COPY ./.env .
COPY ./.eslintrc.js .
COPY ./utils ./utils
COPY ./.gitignore .
COPY ./.gitattributes .
COPY ./.eslintignore .
EXPOSE 8080
CMD [ "npm", "start" ]
