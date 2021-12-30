#!/bin/sh

# Configure Environment
export USE_TEST_TOKEN=1
export IS_CORDOVA_BUILD="true"
export CUSTOM_UA=cordovaios

# Clean build (optional)
if [ "$1" == "clean" ]; then
  rm -rf ./node_modules
  rm -rf ./plugins
  rm -rf ./www
  rm -rf ./platforms
  # Ensure packages are installed
  npm install
fi

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

# Install build on device
adb install -r ./platforms/android/app/build/outputs/apk/debug/app-debug.apk
