#!/usr/bin/env zsh
npm i
npm run build:cn-test
aws s3 sync dist s3://test.live.kidsloop.cn/live
# aws s3 sync dist s3://test.live.kidsloop.cn/class-live
# # demo-school.kidsloop.net
# # demo-home.kidsloop.net
# aws cloudfront create-invalidation --paths /class-live* --distribution-id E2FR6R4F7UAK0I
# # ppe-school.kidsloop.net
# # ppe-home.kidsloop.net
# # kido-school.kidsloop.net
# # kido-home.kidsloop.net
# aws cloudfront create-invalidation --paths /class-live* --distribution-id E1LJ2X1AEAH8EV