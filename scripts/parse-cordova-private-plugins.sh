#!/usr/bin/env bash

set -Eeuo pipefail
trap cleanup SIGINT SIGTERM ERR EXIT

cleanup() {
  trap - SIGINT SIGTERM ERR EXIT
}

# parses the output of package.json to find private repos in the organization
# removes ;,",and spaces with multiple sed instructions
# awk parses the string again to get the correct input for cordova
# xargs passes it to `cordova plugin add`
cat package.json | grep cordova | grep '@kl-engineering' | sed 's/,*$//g;s/"//g;s/[[:space:]]//g;' | awk '{split($0,a,":"); print a[1] "@" a[2]}' | xargs -I{} cordova plugin add {}