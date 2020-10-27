#!/usr/bin/env bash
npm i
npm run build:prod
aws s3 sync dist s3://auth.kidsloop.net/ --dryrun
sleep 15
aws s3 sync dist s3://auth.kidsloop.net/
aws cloudfront create-invalidation --paths "/*" --distribution-id E134FIUH68FUOQ #auth.kidsloop.net
