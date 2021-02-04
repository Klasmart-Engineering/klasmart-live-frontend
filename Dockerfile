FROM node:14
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan bitbucket.org >> ~/.ssh/known_hosts
RUN git config --global url.ssh://git@bitbucket.org.insteadof https://bitbucket.org
ARG CANVAS_PATH
RUN if [ -z $CANVAS_PATH ] ; then npm i $CANVAS_PATH ; fi
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
