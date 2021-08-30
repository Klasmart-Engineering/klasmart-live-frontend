FROM node:14-alpine
RUN apk add --update \
    openssl \
    sed \
    ca-certificates \
    bash \
    openssh \
    make \
    git \
    jq \
    libstdc++ \
    libpng-dev \
    nasm \
    build-base \
    python2 \
    python2-dev \
    # Fix problem with some dependencies: https://github.com/ymedlop/npm-cache-resource/issues/39
    libtool \
    automake \
    autoconf \
    nasm \
  && rm -rf /var/cache/apk/*
WORKDIR /usr/src/app
COPY ./package*.json ./
RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan bitbucket.org >> ~/.ssh/known_hosts
RUN git config --global url.ssh://git@bitbucket.org.insteadof https://bitbucket.org
ARG NODE_MODULES
COPY $NODE_MODULES ./node_modules
RUN --mount=type=ssh if [ -z $NODE_MODULES ] ; then npm i ; fi
COPY ./src ./src
COPY ./tsconfig.json .
COPY ./webpack.config.ts .
COPY ./.env .
COPY ./.eslintrc.js .
COPY ./utils ./utils
COPY ./.gitignore .
COPY ./.gitattributes .
COPY ./.eslintignore .
EXPOSE 8080
CMD [ "npm", "start" ]
