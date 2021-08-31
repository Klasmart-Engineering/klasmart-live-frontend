#!/usr/bin/env bash
# deployment for kidsloop.co.uk
# make sure you run git lfs install && git lfs pull
npm ci --no-audit --no-progress
cp deploy/config/uk/.env.prod ./.env
npm run build
aws s3 sync dist s3://kluk-prod-live/$(date "+%Y%m%d") # backup
aws s3 sync dist s3://kluk-prod-live/latest --delete
aws cloudfront create-invalidation --paths "/*" --distribution-id E383KK3DQGN4I6
