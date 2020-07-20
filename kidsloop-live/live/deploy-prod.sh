#!/usr/bin/env bash
npm run build:prod
aws s3 sync dist s3://kidsloop-live-production/live
aws s3 sync dist s3://kidsloop-live-production/class-live
aws cloudfront create-invalidation --paths /class-live* --distribution-id E2FR6R4F7UAK0I #demo-school.kidsloop.net demo-home.kidsloop.net