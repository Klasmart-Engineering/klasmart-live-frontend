#!/bin/sh

# Configure Environment
export ENDPOINT_GQL=https://live.kidsloop.net/graphql
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

# Exit if webpack build failed
[ $? -ne 0 ] && echo "Failed to build webpack" && exit 1

# Prepare android platform
cordova prepare ios

open platforms/ios/KidsLoop.xcworkspace
