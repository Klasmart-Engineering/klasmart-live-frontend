#!/bin/bash
DOCKER_BUILDKIT=1 docker build --ssh default -f BuildAppBuildkit.Dockerfile -t cordovabuild .
docker create -ti --name cordovabuild cordovabuild bash
docker cp cordovabuild:/app/build ./
docker rm -f cordovabuild
