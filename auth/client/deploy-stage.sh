#!/usr/bin/env bash
npm i
npm run build:prod
aws s3 sync dist s3://auth.kidsloop.net/stage --dryrun
sleep 5
aws s3 sync dist s3://auth.kidsloop.net/stage
aws cloudfront create-invalidation --paths "/stage*" --distribution-id E134FIUH68FUOQ #auth.kidsloop.net
