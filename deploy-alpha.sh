#!/usr/bin/env bash
npm ci
mv deploy/config/internal/.env.alpha ./.env
npm run build
aws s3 sync dist s3://kidsloop-alpha-live-crack-drake/
aws cloudfront create-invalidation --paths "/*" --distribution-id E2694SIA1FLALO #live.alpha.kidsloop.net