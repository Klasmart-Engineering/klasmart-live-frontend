#!/bin/sh

# Configure Environment
export USE_TEST_TOKEN=1
export IS_CORDOVA_BUILD="true"

# Clean build (optional)
if [ "$1" == "clean" ]; then
  rm -rf ./node_modules
  rm -rf ./plugins
  rm -rf ./www
  rm -rf ./platforms
fi

# Ensure packages are installed
npm install

# Package using webpack
npm run build:app

# Exit if webpack build failed
[ $? -ne 0 ] && echo "Failed to build webpack" && exit 1

# Override compile SDK version to 31 (solving issue trying to reference missing lStar value)
# export ORG_GRADLE_PROJECT_cdvCompileSdkVersion=31

# Prepare android platform
cordova prepare android

# Build apk
cordova build android -- --buildConfig
