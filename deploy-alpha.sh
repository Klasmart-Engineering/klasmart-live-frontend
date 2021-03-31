#!/usr/bin/env bash
npm i
npm audit fix
npm run build:alpha
aws s3 sync dist s3://kidsloop-alpha-live-crack-drake/
aws cloudfront create-invalidation --paths "/*" --distribution-id E2694SIA1FLALO #live.alpha.kidsloop.net