#!/usr/bin/env bash
npm run build:prod
aws s3 sync dist s3://kidsloop-live-production/live
aws s3 sync dist s3://kidsloop-live-production/class-live
# demo-school.kidsloop.net
# demo-home.kidsloop.net
aws cloudfront create-invalidation --paths /class-live* --distribution-id E2FR6R4F7UAK0I
# ppe-school.kidsloop.net
# ppe-home.kidsloop.net
# kido-school.kidsloop.net
# kido-home.kidsloop.net
aws cloudfront create-invalidation --paths /class-live* --distribution-id E1LJ2X1AEAH8EV