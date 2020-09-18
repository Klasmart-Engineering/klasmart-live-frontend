#!/usr/bin/env bash
npm i
npm run build:prod
aws s3 sync dist s3://kidsloop-live-beta/class-live
aws s3 sync dist s3://kidsloop-live-beta/live
aws cloudfront create-invalidation --paths /live* --distribution-id E28L3SG4NDQGZ7 #live.kidsloop.net