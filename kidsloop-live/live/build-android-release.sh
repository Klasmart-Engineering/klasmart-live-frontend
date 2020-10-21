#!/bin/sh

# Configure Environment
export ENDPOINT_SFU=wss://live.kidsloop.net/sfu
export ENDPOINT_WEBSOCKET=wss://live.kidsloop.net/graphql
export ENDPOINT_GQL=https://live.kidsloop.net/graphql
export ENDPOINT_CONTENT=https://live.kidsloop.net/
export DISABLE_BROWSER_GUIDE=1
export DISABLE_SCREEN_SHARE=1
export USE_TEST_TOKEN=1

# Package using webpack
npm run build:app:release

# Clean Build
rm -rf ./platforms/android

# Prepare android platform
cordova prepare android

# Build apk
cordova build android --release -- --keystore=./keystore/kidsloop-platform.keystore --storePassword=kidsloop --alias=kidsloop_platform_production --password=kidsloop
