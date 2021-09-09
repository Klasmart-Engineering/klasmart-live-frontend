#!/bin/sh

# Configure Environment
export USE_TEST_TOKEN=1
export IS_CORDOVA_BUILD="true"

# Clean Build
rm -rf ./www
rm -rf ./platforms/android

# Ensure packages is installed
npm install

# Package using webpack
npm run build:app:release

# Exit if webpack build failed
[ $? -ne 0 ] && echo "Failed to build webpack" && exit 1

# Prepare android platform
cordova prepare android

# Build apk
cordova build android --release -- --buildConfig
