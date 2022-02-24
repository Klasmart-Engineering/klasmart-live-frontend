#!/usr/bin/env bash

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
  trap - SIGINT SIGTERM ERR EXIT
}

# Modify the CDVWebViewEngine to  set allowFileAccessFromFileURLs and allowUniversalAccessFromFileURLs to TRUE
webViewEngineFilePath='./platforms/ios/CordovaLib/Classes/Private/Plugins/CDVWebViewEngine/CDVWebViewEngine.m'
wkWebViewConfigurationLine='WKWebViewConfiguration\* configuration = \[\[WKWebViewConfiguration alloc\] init\]\;'
allowFileAccessFromFileURLsLine='\[configuration.preferences setValue\:\@TRUE forKey\:\@\"allowFileAccessFromFileURLs\"\]\;'
allowUniversalAccessFromFileURLsLine='\[configuration setValue\:\@\"TRUE\" forKey\:\@\"allowUniversalAccessFromFileURLs\"\]\;'

if ! grep -q "allowUniversalAccessFromFileURLs" "$webViewEngineFilePath"; then
  printf "\e[1;33m\nWarning: The CDVWebViewEngine need to be modified that set\e[0m \e[1;34mallowUniversalAccessFromFileURLs\e0m \e[1;33mto TRUE.\e[0m\n"
  echo -e "Starting modify the CDVWebViewEngine at:\n$webViewEngineFilePath"
  newCDVWebViewEngine=$(sed "s/$wkWebViewConfigurationLine/$wkWebViewConfigurationLine\n\t$allowUniversalAccessFromFileURLsLine/" $webViewEngineFilePath)
  echo "$newCDVWebViewEngine" > $webViewEngineFilePath
  printf "\e[1;32mThe CDVWebViewEngine was modified successful.\e[0m\n"
fi

if ! grep -q "allowFileAccessFromFileURLs" "$webViewEngineFilePath"; then
  printf "\e[1;33m\nWarning: The CDVWebViewEngine need to be modified that set\e[0m \e[1;34mallowFileAccessFromFileURLs\e0m \e[1;33mto TRUE.\e[0m\n"
  echo -e "Starting modify the CDVWebViewEngine at:\n$webViewEngineFilePath"
  newCDVWebViewEngine=$(sed "s/$wkWebViewConfigurationLine/$wkWebViewConfigurationLine\n\t$allowFileAccessFromFileURLsLine/" $webViewEngineFilePath)
  echo "$newCDVWebViewEngine" > $webViewEngineFilePath
  printf "\e[1;32mThe CDVWebViewEngine was modified successful.\e[0m\n"
fi
