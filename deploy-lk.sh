#!/usr/bin/env bash
# deployment for kidsloop.co.lk
# make sure you run git lfs install && git lfs pull
npm ci --no-audit --no-progress
cp deploy/config/lk/.env.prod ./.env
npm run build
aws s3 sync dist s3://kllk-prod-live/$(date "+%Y%m%d") # backup
aws s3 sync dist s3://kllk-prod-live/latest --delete
aws cloudfront create-invalidation --paths "/*" --distribution-id EPX5VCZMEEQWX
