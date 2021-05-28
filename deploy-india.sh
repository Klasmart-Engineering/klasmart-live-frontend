#!/usr/bin/env bash
npm i
npm audit fix
npm run build:prod-india
aws s3 sync dist s3://klindia-prod-live/latest
aws cloudfront create-invalidation --paths "/*" --distribution-id E3E2KLVUMN9GCO #live.kidsloop.in
