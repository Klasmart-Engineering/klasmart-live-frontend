#!/bin/sh

# Configure Environment
export ENDPOINT_GQL=https://live.kidsloop.net/graphql
export DISABLE_BROWSER_GUIDE=1
export DISABLE_SCREEN_SHARE=1
export USE_TEST_TOKEN=1
export WEBRTC_DEVICE_HANDLER_NAME=Safari12
export CUSTOM_UA=cordovaios

# Clean Build
rm -rf ./www
# rm -rf ./platforms/android

# Ensure packages is installed
npm install

# Package using webpack
npm run build:app

# Prepare android platform
cordova prepare ios

open platforms/ios/KidsLoop.xcworkspace
