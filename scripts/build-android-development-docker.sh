#!/bin/bash

docker build --build-arg SSH_PRIVATE_KEY="$(base64 -w 0 < ~/.ssh/id_rsa)" -f BuildApp.Dockerfile -t cordovabuild .
docker create -ti --name cordovabuild cordovabuild bash
docker cp cordovabuild:/app/build ./
docker rm -f cordovabuild
