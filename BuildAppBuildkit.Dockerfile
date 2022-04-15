FROM frolvlad/alpine-glibc as androidsdk

RUN apk update && \
    apk upgrade && \
    apk --no-cache add \
    openjdk8 \
    ca-certificates \
    openssl \
    bash \
    git \
    ruby \
    ruby-bundler \
    ruby-json \
    ruby-dev \
    make \
    gcc \
    libc-dev \
    wget

ENV ANDROID_SDK_ROOT=/usr/local/sdk
ENV CLI_TOOL_VERSION=commandlinetools-linux-6858069_latest
ENV JAVA_HOME=/usr/lib/jvm/java-1.8-openjdk
ENV PATH=$PATH:$ANDROID_SDK_ROOT:$ANDROID_SDK_ROOT/cmdline-tools/tools/bin

# install android sdk
RUN mkdir -p $ANDROID_SDK_ROOT/cmdline-tools && \
    wget "https://dl.google.com/android/repository/${CLI_TOOL_VERSION}.zip" && \
    unzip -d $ANDROID_SDK_ROOT/cmdline-tools $CLI_TOOL_VERSION.zip && \
    rm -rf $CLI_TOOL_VERSION.zip && \
    mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/tools

# prepare sdkmanager
RUN yes | sdkmanager --licenses

# install android tools and more
RUN sdkmanager "tools" "build-tools;30.0.2" "platforms;android-30" "platform-tools" "extras;android;m2repository" && \
    sdkmanager --uninstall "patcher;v4" "emulator"

FROM androidsdk as builder

# Install dependencies
RUN apk add \
    openssh-client \
    curl \
    gradle \
    build-base \
    automake \
    autoconf \
    libtool \
    libpng-dev \
    nasm \
    nodejs \
    npm

RUN npm install -g cordova

FROM builder
RUN mkdir -m 700 ~/.ssh; touch -m 600 ~/.ssh/known_hosts; ssh-keyscan bitbucket.org > ~/.ssh/known_hosts


ENV IS_CORDOVA_BUILD="true"

WORKDIR /app

# ENV PATH=/app/node_modules/.bin:$PATH

COPY package.json ./
COPY package-lock.json ./

RUN --mount=type=ssh npm ci --no-audit --no-progress --silent

# Set cordova compile sdk version
ENV ORG_GRADLE_PROJECT_cdvCompileSdkVersion 30

# Prepare Platform
COPY ./scripts ./scripts
COPY ./res ./res
COPY ./keystore ./keystore

COPY ./newrelic.properties ./
COPY ./config.xml ./

RUN mkdir www

RUN --mount=type=ssh cordova prepare android

# Prepare webpack
COPY ./tsconfig.json ./
COPY ./webpack.cordova.config.ts ./
COPY ./tests ./tests
COPY ./public ./public
COPY ./src ./src

# Webpack build
RUN npm run build:app

# Build Application
RUN cordova build android -- --buildConfig

RUN mkdir build
RUN cp -r ./platforms/android/app/build/outputs/* ./build/
