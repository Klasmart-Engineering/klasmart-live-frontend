# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [6.8.0](https://github.com/KL-Engineering/kidsloop-live-frontend/compare/v6.7.0...v6.8.0) (2022-04-28)


### 🐛 Bug Fixes

* canvas does not display correctly in study and class type (#97) ([35b0361](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/35b03619bde2f93bb8c5f842d117e0320bdacd46)), closes [/calmisland.atlassian.net/browse/NAT-822](https://calmisland.atlassian.net/browse/NAT-822)
* user sign in without selecting profile (#90) ([9a4e9b6](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/9a4e9b6f5ab8c4494e81bfa45d8b599f21950480)), closes [/calmisland.atlassian.net/browse/NAT-807](https://calmisland.atlassian.net/browse/NAT-807)


### ✨ Features

* formating all popups following the new design in ticket 2645 (#22) ([fa2bf13](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/fa2bf13620120402ee0163bc3ab3570cf1dc559c)), closes [/calmisland.atlassian.net/browse/NAT-30](https://calmisland.atlassian.net/browse/NAT-30)
* **localization:** add new translations ([06797e0](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/06797e03ee26c85801e88ad16f2ec04fef74c6b5))
* **localization:** add new translations (#85) ([fd47380](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/fd47380fe9fc9ab6da0ba952be4142a14c80ef81))
* **localization:** add new translations (#86) ([26e3095](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/26e3095ffae811ab678b7355743b278b1a24fc67))
* **localization:** add new translations (#91) ([e347226](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/e347226d2c0f892564e91b968e90980a90889d56))
* **localization:** add new translations (#92) ([85a6bf5](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/85a6bf5ef7d349d25537c0776960b5f1f51fa08e))
* **translation:** update translations (#96) ([26955ea](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/26955eaf9303f14a1da0f00846d3f1d65599491c))

## [6.7.0](https://github.com/KL-Engineering/kidsloop-live-frontend/compare/v6.6.1...v6.7.0) (2022-04-26)


### 🐛 Bug Fixes

* ask user to choose organization whenever changing user profile (#82) ([220f6dd](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/220f6dd4e64a90f06380699573a10f977807b263)), closes [NAT-731](https://calmisland.atlassian.net/browse/NAT-731)
* change text color Organization/Profile page (#89) ([3298af6](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/3298af61230d7b031c212b697f87807a9a17e969)), closes [NAT-781](https://calmisland.atlassian.net/browse/NAT-781)


### ✨ Features

* allow users to hide show their canvas 2450 (#20) ([5a3da0e](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/5a3da0e1d3071fc93141138830c789c2e482d9f9)), closes [KLL-2450](https://calmisland.atlassian.net/browse/KLL-2450) [NAT-44](https://calmisland.atlassian.net/browse/NAT-44)
* change size observe mode (#87) ([e35aacb](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/e35aacbfc8086762e54b465774f1817ca66b5971)), closes [NAT-59](https://calmisland.atlassian.net/browse/NAT-59)
* enable canvas in On Stage Mode (#38) ([b1d5a08](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/b1d5a0894c2fedac64d83b5a41c8869a17bae35c)), closes [KLL-2874](https://calmisland.atlassian.net/browse/KLL-2874)

### [6.6.1](https://github.com/KL-Engineering/kidsloop-live-frontend/compare/v6.6.0...v6.6.1) (2022-04-25)


### 🐛 Bug Fixes

* kll-3561 SessionContext.token is now initialized before first render rather than after (#81) ([0d19ed5](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/0d19ed5dfec24a8528308b0a713145c8941e0187)), closes [kll-3561](https://calmisland.atlassian.net/browse/kll-3561) [KLL-3561](https://calmisland.atlassian.net/browse/KLL-3561)


### 🔨 Build

* **package:** bump state lib to version deployed in prod (#83) ([8c16f39](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/8c16f39db7a289d60ec315cc66aaa7868937ceca))

## [6.6.0](https://github.com/KL-Engineering/kidsloop-live-frontend/compare/v6.5.2...v6.6.0) (2022-04-22)


### ⚙️ Continuous Integrations

* update environment for VN (#79) ([f735635](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/f735635c3b8efbdcb44cf806b790107b3ef62ae6))


### ✨ Features

* add parental lock back (#78) ([3dc6d26](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/3dc6d26e8f259aae609fd0ca18de5587ebbea8ed)), closes [NAT-797](https://calmisland.atlassian.net/browse/NAT-797)

### [6.5.2](https://github.com/KL-Engineering/kidsloop-live-frontend/compare/v6.5.1...v6.5.2) (2022-04-21)


### 🐛 Bug Fixes

* fetch 'undefined/refresh' (#76) ([d142973](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/d1429735f3fca0c52c9a86735b7a1a1258ce796f))


### 🗑 Reverts

* **live-state:** roll back live-state to 1.4.4 (#77) ([348c91d](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/348c91d92781f911163236dcb37e6e0baf70176c))

### [6.5.1](https://github.com/KL-Engineering/kidsloop-live-frontend/compare/v6.5.0...v6.5.1) (2022-04-20)


### 🐛 Bug Fixes

* add missing Lokalise string (#74) ([ae19869](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/ae198694b81077e9152808aa09566eac7e38b458))


### 🗑 Reverts

* "chore: bump kidsloop-live-state to 1.5.0 (#71)" (#75) ([155d328](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/155d3285ad3f039a832648898544320f6e3c9cbc))
* change size of observe mode in fullscreen (#73) ([7a3b01d](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/7a3b01dabd345045e92cbc64de0022c28d9b32cc))
* restructure settings page (#72) ([f79e383](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/f79e383ea272e8b17a61ebdf8b6a2f9174dc12e1))

## [6.5.0](https://github.com/KL-Engineering/kidsloop-live-frontend/compare/v6.4.0...v6.5.0) (2022-04-19)


### ✨ Features

* change size of observe mode in fullscreen (#15) ([1be795a](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/1be795a19ed72d1cbb7f8c800abc13a4f1c2e31a)), closes [NAT-59](https://calmisland.atlassian.net/browse/NAT-59)
* restructure settings page (#70) ([fdf77ad](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/fdf77ad35132e9fd7fdb8ee5b583879ebe38d1d7)), closes [nat-702](https://calmisland.atlassian.net/browse/nat-702) [nat-727](https://calmisland.atlassian.net/browse/nat-727) [nat-697](https://calmisland.atlassian.net/browse/nat-697) [nat-730](https://calmisland.atlassian.net/browse/nat-730) [nat-695](https://calmisland.atlassian.net/browse/nat-695) [nat-696](https://calmisland.atlassian.net/browse/nat-696)


### 🐛 Bug Fixes

* chip title display strange number in anytime study (#69) ([5008867](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/5008867d500daad8f82c1eca35f8dfd91f77c63a)), closes [NAT-782](https://calmisland.atlassian.net/browse/NAT-782)
* user unable to select arrows to go to the next and previous item (#50) ([c54a921](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/c54a92142d6d01e09672819c39c92ed2a3267982)), closes [KLL-3239](https://calmisland.atlassian.net/browse/KLL-3239)


### ♻️ Chores

* bump kidsloop-live-state to 1.5.0 (#71) ([2b2920b](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/2b2920bd0b9c9e3fc9c35bd2ca2847472b00547e))

## [6.4.0](https://github.com/KL-Engineering/kidsloop-live-frontend/compare/v6.3.0...v6.4.0) (2022-04-18)


### 🐛 Bug Fixes

* **app:** unable get auth token and haven't permission to access the camera on APP (#43) ([36b82c5](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/36b82c5e31cd5e85b54242d513da42c51c74c760)), closes [KLL-3361](https://calmisland.atlassian.net/browse/KLL-3361) [KLL-3360](https://calmisland.atlassian.net/browse/KLL-3360)
* rename extension file pdfviewer in webpack config (#67) ([6cdc9f4](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/6cdc9f481091cda039fe3e80583e16f226ae95b5))


### ✨ Features

* **localization:** add new translations (#68) ([0b2b511](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/0b2b5115f8e1837f144e3e4289c3c73174b2c35c))

## [6.3.0](https://github.com/KL-Engineering/kidsloop-live-frontend/compare/v6.2.0...v6.3.0) (2022-04-15)


### ♻️ Chores

* change versionrc url formats from Bitbucket to GitHub (#54) ([f65a25b](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/f65a25b443d2b89065c8aaa19994e1e751e44ec4))


### ⚙️ Continuous Integrations

* Feature/kidskube refactor (#57) ([731d64f](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/731d64f60b3951ffd2a16d152642e43a0ede8425))


### ✨ Features

* add reports option to hamburger menu (hidden option) (#61) ([70cdf4f](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/70cdf4f62399676f1ed4e622b81b5a614f03493d)), closes [NAT-64](https://calmisland.atlassian.net/browse/NAT-64)
* **localization:** add new translations (#65) ([68151db](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/68151dbb032aafdc4ab7053572861109e86b3bc8))
* **localization:** add new translations (#66) ([7da39c4](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/7da39c4bd9d0f65225cae5fb261ecbf1a586f8c6))
* parental lock design replacement (#23) ([df01f0e](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/df01f0e2a52f066d66134dd1af2c9be5008e3e3d)), closes [KLL-2878](https://calmisland.atlassian.net/browse/KLL-2878)
* refresh schedule design (#51) ([7f6f734](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/7f6f7347bfcf90de691e97ab346129c8acb54b03)), closes [NAT-43](https://calmisland.atlassian.net/browse/NAT-43)
* resize student cameras to fit less on the screen (#53) ([7a3368e](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/7a3368e2914cad0e5f94099c2062d289645f3e35)), closes [KLL-3389](https://calmisland.atlassian.net/browse/KLL-3389)
* use PDF v2 API (#62) ([a727700](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/a727700d05257b928d7a589a809cac8ccb163951)), closes [KLL-2803](https://calmisland.atlassian.net/browse/KLL-2803) [KLL-2758](https://calmisland.atlassian.net/browse/KLL-2758) [KLL-2647](https://calmisland.atlassian.net/browse/KLL-2647) [KLL-2641](https://calmisland.atlassian.net/browse/KLL-2641) [KLL-2758](https://calmisland.atlassian.net/browse/KLL-2758) [KLL-2641](https://calmisland.atlassian.net/browse/KLL-2641) [KLL-2758](https://calmisland.atlassian.net/browse/KLL-2758) [KLL-2758](https://calmisland.atlassian.net/browse/KLL-2758)


### 🐛 Bug Fixes

* add userId as url parameter + use userId only in type Class (#63) ([ae8f8b6](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/ae8f8b6c42d02cb10a80da1e7f3f5cffe05c62db)), closes [KLL-3015](https://calmisland.atlassian.net/browse/KLL-3015) [KLL-3525](https://calmisland.atlassian.net/browse/KLL-3525)
* SFU-60 unknown device (#64) ([967ae71](https://github.com/KL-Engineering/kidsloop-live-frontend/commit/967ae71a70f0e68d253dd6ef1f2f52cbeb83944a))

## [6.2.0](https://github.com/KL-Engineering/kidsloop-live-frontend/branches/compare/v6.2.0%0Dv6.1.0) (2022-04-12)


### ✨ Features

* **localization:** add new translations (#58) ([6f4d08b](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/6f4d08bc75c3913cdc75105343b52e3e186ea48b))
* **localization:** add new translations (#60) ([3c183a2](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/3c183a2530dc2b54c0f9786ae72e86789605e4ff))


### 🐛 Bug Fixes

* show "X" icon + canvas icon in Study (#59) ([7b499e1](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/7b499e19b52223ccba43945f373cd45a64726d5b)), closes [NAT-716](https://calmisland.atlassian.net/browse/NAT-716) [NAT-33](https://calmisland.atlassian.net/browse/NAT-33)

## [6.1.0](https://github.com/KL-Engineering/kidsloop-live-frontend/branches/compare/v6.1.0%0Dv6.0.3) (2022-04-11)


### 🐛 Bug Fixes

* fix screen stays in landscape mode if user exit from camera mic setup (#40) ([eee6a4d](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/eee6a4d4abc2cdaa96210cb186d1b97434b62206)), closes [KLL-2089](https://calmisland.atlassian.net/browse/KLL-2089)
* screenshare not working on safari [KLL-3433](https://calmisland.atlassian.net/browse/KLL-3433) (#46) ([565bcc4](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/565bcc40df583b2aa4c590f0836406fd802be068))
* trigger endClass mutation on leave of class type (#52) ([4f3d941](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/4f3d94196ed7ae3eea5fad31adb2156ab17c5c67)), closes [KLL-3484](https://calmisland.atlassian.net/browse/KLL-3484)


### ⚙️ Continuous Integrations

* enabling deployments to kidskube env landing zone ([31abca5](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/31abca5eb1f1c924fd7092a8a088aa55fa93c523))


### ✨ Features

* hamburger menu renewal (#45) ([a72f014](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/a72f014be32ad726f99fecae1181b821579cb2d8)), closes [NAT-63](https://calmisland.atlassian.net/browse/NAT-63)
* redesign loading page failed (#44) ([13a2750](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/13a2750fb701271f53c3539b07e2397cbaf56e70)), closes [NAT-495](https://calmisland.atlassian.net/browse/NAT-495)


### ♻️ Chores

* add NAT jira tickets link to version releases (#56) ([1fa93b4](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/1fa93b4ae153590b8fd034715ec93bd25eec82d2))
* bump live state version SFU-70 (#48) ([0c59ad1](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/0c59ad1db51570e263daf25095a7a1216c159185))
* bump live-state to 1.4.5 (#55) ([cf550f9](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/cf550f95b2399de9a6833090810ee3c6a4002b37))

### [6.0.3](https://github.com/KL-Engineering/kidsloop-live-frontend/branches/compare/v6.0.3%0Dv6.0.2) (2022-04-07)


### 🐛 Bug Fixes

* live class crashes without material [KLL-2838](https://calmisland.atlassian.net/browse/KLL-2838) (#36) ([7e68156](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/7e68156fc46a62cfe8f1b5ab0058ef5159f2b403))


### ⚙️ Continuous Integrations

* add conventional pr title workflow (#37) ([3c554f9](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/3c554f922cbd46155786f35cefc72608b894d571))
* fix workflow input variable name ([b7ec1d0](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/b7ec1d0e9f11c113da76443eeffe5e06e09047df))
* run tests before commit ([67dae81](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/67dae8175a4c1d8f259ecbf0a24efa152b457d01))
* separate pr workflows for meta info and commits ([f4353ae](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/f4353ae1b737a5e73271a54d5af735e6f51d24ae))


### 💎 Style

* format workflow file ([793fab3](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/793fab3056445345ab4d58945eb831a997f74880))


### 🗑 Reverts

* apollo upgrade version (feature KLL- 3294) #47 ([0741265](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/0741265d10b301991e87882036a84c79d062355a))

### [6.0.2](https://github.com/KL-Engineering/kidsloop-live-frontend/branches/compare/v6.0.2%0Dv6.0.1) (2022-04-05)


### 🐛 Bug Fixes

* update style to correct background (#34) ([1aeffd2](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/1aeffd2cdd72c842b93fee2f9fbfed380ca018ee))

### [6.0.1](https://github.com/KL-Engineering/kidsloop-live-frontend/branches/compare/v6.0.1%0Dv6.0.0) (2022-04-04)


### 🐛 Bug Fixes

* can not leave class after confirm leave popup (#13) ([35a3f13](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/35a3f138d75736bd39bc3ad61555bf1fed3c5853))
* class is ending abruptly after selecting students in Class Mode [KLL-3437](https://calmisland.atlassian.net/browse/KLL-3437) ([d14d929](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/d14d92940f62572754982c2598a5ce48ec415229))
* crashed when writing large file (#16) ([9a51577](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/9a5157707402eb8c9027700d797a2eba7046b644)), closes [KLL-2986](https://calmisland.atlassian.net/browse/KLL-2986)
* use kl-engineering alias for custom cordova plugins (#33) ([38632cf](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/38632cfec94ff475e604ca5cbb3e20f7c6e469d9))

## [6.0.0](https://github.com/KL-Engineering/kidsloop-live-frontend/branches/compare/v6.0.0%0Dv5.2.0) (2022-04-01)


### ⚠ BREAKING CHANGES

* upgrade websocket package to graphql-ws KLL-3294

### 🐛 Bug Fixes

* [class] layout broken on last page [KLL-3348](https://calmisland.atlassian.net/browse/KLL-3348) (#17) ([d563e9b](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/d563e9b8beda08030201be6bd6a2b02519d2a457))
* play trophy audio for everyone except teacher (#26) ([57d0887](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/57d088723bf39bd7e674af3170aa3e76b6e43a33))


### ⚙️ Continuous Integrations

* update reusable workflows to load assets with git lfs ([b84967b](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/b84967bbe1a7224fcde67ab98aba4014b5200858))
* use reusable workflows (#27) ([d653b9c](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/d653b9cabcb093e2159f110399d1f7ab74822bb2))


### ✨ Features

* add ClassActiveUser in the Class interface [KLL-3015](https://calmisland.atlassian.net/browse/KLL-3015) ([dd090d6](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/dd090d68db250639afa5a2822fdc6ec410e8eed0))
* redesign select profile [KLL-2353](https://calmisland.atlassian.net/browse/KLL-2353) ([3d9e132](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/3d9e1329717051a51a646ac5ff66169bdde7e032))
* **translation:** update translations (#30) ([351d02e](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/351d02e1657edbcf309fd061ad353b0911d3741c))
* upgrade websocket package to graphql-ws [KLL-3294](https://calmisland.atlassian.net/browse/KLL-3294) ([0865550](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/086555053e934db8be8cf339103dbc0dd56ed35f))
* web add manual attendance for class [KLL-3014](https://calmisland.atlassian.net/browse/KLL-3014)  [KLL-3291](https://calmisland.atlassian.net/browse/KLL-3291) ([da9327b](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/da9327b5cac3a70955066b7929f8879eb7f86b38))

## [5.2.0](https://github.com/KL-Engineering/kidsloop-live-frontend/branches/compare/v5.2.0%0Dv5.2.0-alpha.1) (2022-03-31)


### Features

* add new cursor in canvas action ([64a89a9](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/64a89a92d6c47f4a369acc27903522e1c4a1b121)), closes [KLL-2364](https://calmisland.atlassian.net/browse/KLL-2364)
* as a student, hide cam/mic mute buttons for other students ([6743c3f](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/6743c3f11f95d3e3295244f463f15f84d999191a)), closes [KLL-3017](https://calmisland.atlassian.net/browse/KLL-3017)
* disable toolbar mic and camera buttons and add spinner when waiting for startup or shutdown ([9f6bb35](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/9f6bb35b9e0e39531a793db7b77317fe5f33e714)), closes [KLL-3104](https://calmisland.atlassian.net/browse/KLL-3104)
* improved onboarding experience ([34f69ea](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/34f69ead98812e6d755e116c8474d9e72aff0571)), closes [KLL-2228](https://calmisland.atlassian.net/browse/KLL-2228)
* **localization:** add new translations ([05e1c26](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/05e1c26cd5c023d20fdad7eafcc05821ae03d746))
* **localization:** add new translations ([40a9645](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/40a9645aad51161376648c5e731ea02ca6474f3c))
* **localization:** add new translations ([fedf77a](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/fedf77a0ee3294db22bf701b328295f9095b494a))
* redesign select organization screen ([b68d355](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/b68d355d4abc5cb372f9504fa4011cb39041b743)), closes [KLL-2354](https://calmisland.atlassian.net/browse/KLL-2354)
* replace design for no org screen ([8f6f2de](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/8f6f2de0c968aa9adf0329826e92b80ad033d4f8)), closes [KLL-3220](https://calmisland.atlassian.net/browse/KLL-3220)


### Bug Fixes

* chat input focus zone bigger ([20523aa](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/20523aaa88213f395752df617e412626a83f5f0d)), closes [KLL-2846](https://calmisland.atlassian.net/browse/KLL-2846)
* dependency paths ([8dff902](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/8dff902636d724d2e38c10d2efa8ef41c4d0257a))
* disable submit when no attachment file ([f531b2f](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/f531b2f5172afc4ddd444c4a4d2dc58546ae7297)), closes [fix/KLL-2876](https://calmisland.atlassian.net/browse/KLL-2876) [Fix/KLL-2876](https://calmisland.atlassian.net/browse/KLL-2876)
* fix tooltips to show correct permission state of canvas ([e72fbe6](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/e72fbe6ea173c266f4e0f3e63202d06d23361d48))
* install workflow ([6372aa8](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/6372aa82d87e40310a6970dbba327cc74cc70ffb))
* load assets with git lfs ([5f873f6](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/5f873f64f96517cd7f555a49dde748bd3cd5a36c))
* make screenshareViewVideo fit in the screen [KLL-3347](https://calmisland.atlassian.net/browse/KLL-3347) (#5) ([8966b9a](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/8966b9acde2601440c88b0588f45fe40a47a4898))
* re-apply selectColorByValue when canvas is rendered [KLL-3209](https://calmisland.atlassian.net/browse/KLL-3209) ([7115b37](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/7115b3758187e65fa5550ec367986e5f75f7cd17))
* remove clashing secret ([62d2578](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/62d25783fadb7f5bc481fc850bb218817f39b9e5))
* remove great job title ([e0876de](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/e0876ded6a3c2908f84db6744bd4b171643e2e28)), closes [KLL-2356](https://calmisland.atlassian.net/browse/KLL-2356)
* remove unwanted scrollbars breaking layout in Study / Class + force CanvasColor toolbar in the view ([ff6339a](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/ff6339a3ccdc7b1a8a1bdf4b442419cb50396394))
* **screenshare.tsx:** stop screen share when clicking "Stop Sharing" from the OS ([c4d6848](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/c4d6848a010510b1913f37228375cca62411cbe2)), closes [KLL-3188](https://calmisland.atlassian.net/browse/KLL-3188)
* snackbar makes the product crash [KLL-3376](https://calmisland.atlassian.net/browse/KLL-3376) (#21) ([a410086](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/a4100867ae7ee9d5695083db4ac48924ab19d329))
* update title and popup title, this field get from title response ([44fd216](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/44fd2164a3054565e3c7c644ce0628ba3ba9459e)), closes [KLL-1344](https://calmisland.atlassian.net/browse/KLL-1344)
* userActions translations and fix state of mic/cam ([75c815d](https://github.com/KL-Engineering/kidsloop-live-frontend/commits/75c815d89533a5fb3ae09c1a0a5042e7317bd6e9)), closes [KLL-3290](https://calmisland.atlassian.net/browse/KLL-3290)

## [5.2.0-alpha.1](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v5.2.0-alpha.1%0Dv5.2.0-alpha.0) (2022-03-22)


### Features

* add isReview field to token ([ca8c0ac](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ca8c0acf436f6babba5fe03c78841e98aba2c739)), closes [KLL-1343](https://calmisland.atlassian.net/browse/KLL-1343)
* display title and class type for review type ([45dd32d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/45dd32d603fbe608e1f71af0829a3476e9c1d7bc)), closes [KLL-1344](https://calmisland.atlassian.net/browse/KLL-1344)
* **localization:** add new translations ([dea76a6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/dea76a65c4aabcd297e2b584455185df91af249d))
* **localization:** add new translations ([c47b384](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c47b384d40fea46df9e5080d4ec3e4f98bda191c))
* **localization:** add new translations ([23476c3](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/23476c3fa3adaa74a9e062e60a36b3f485ccf820))
* **localization:** add new translations ([74f5ef1](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/74f5ef1c92d2ddcd665388c00d6f60126e950930))
* **localization:** add new translations (live.enter) ([293cb60](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/293cb60fcb32b049ec74e15767ec07412ef3cbaa))

## [5.2.0-alpha.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v5.2.0-alpha.0%0Dv5.1.0) (2022-03-16)


### Features

* add tooltip to web for student and teacher ([596570f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/596570f5c8a367e3d28f515e85843d652b731a42)), closes [KLL-2674](https://calmisland.atlassian.net/browse/KLL-2674)
* add version and health pages ([12ab0e7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/12ab0e7865ca82719ea921526acbc209533f8fbe))
* **localization:** add new translations ([5a4e543](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5a4e543b17411c284685538a89597acb74e66357))


### Bug Fixes

* add version when injecting flashcard.js ([3d944c7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3d944c7e77a9a282b80edfec781515efa68113cc)), closes [KLL-2118](https://calmisland.atlassian.net/browse/KLL-2118)
* bigger mic selector join page Study and Class + scrollbar style study ([7086f83](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7086f83b65f248246bea4309481e3075a376218e))
* canvas toolbar improvements ([ec97508](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ec97508b05426b7f24e3f9fcf0edf78cbc56fb8a)), closes [KLL-2722](https://calmisland.atlassian.net/browse/KLL-2722) [KLL-2722](https://calmisland.atlassian.net/browse/KLL-2722)
* **cordova:** use relative path (href) ([cfa474c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/cfa474c8c3558e342bbeee78ad15dc66580cdf14)), closes [KLL-3246](https://calmisland.atlassian.net/browse/KLL-3246)
* don't redirect to login useAuthenticationContext ([f6af5c1](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f6af5c1b4a0cb8d895ec7166c85a4bb0ce099eb2)), closes [KLL-3243](https://calmisland.atlassian.net/browse/KLL-3243)
* non-host teacher does not see canvas unless given canvas permission by host ([a6e129a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a6e129a1630c90c36103b08f2539c78356d5f769)), closes [KLL-2841](https://calmisland.atlassian.net/browse/KLL-2841)
* show camera settings only in Live ([ff203cc](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ff203cca640ffbfd1d2b94dda0091c696665c4ac))
* **translation:** add new translations ([057a671](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/057a6716a450348b1feb1634ca6afca22096834a))

## [5.1.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v5.1.0%0Dv5.0.0) (2022-03-14)


### Features

* display message when speech recognition is unsupported ([608f620](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/608f620f396a6ed3dce00afa150a8bbd03f3d14a)), closes [KLL-2118](https://calmisland.atlassian.net/browse/KLL-2118)
* redesign exit study screen ([2810a29](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/2810a296d1b54caf8cae3c66e868a35c2d5b1f58)), closes [KLL-2356](https://calmisland.atlassian.net/browse/KLL-2356)


### Bug Fixes

* add inlineStylesheet option to rrweb recorder ([7692318](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7692318237e1ad4480d38ed026f2c50fc0699917)), closes [KLL-2460](https://calmisland.atlassian.net/browse/KLL-2460)
* file validation missing in HFS page ([3f07608](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3f07608699f02d38540b0744f1826b4932f4da7e)), closes [KLL-2988](https://calmisland.atlassian.net/browse/KLL-2988) [KLL-2986](https://calmisland.atlassian.net/browse/KLL-2986)
* mismatch teachers/students in the sidebar UI [KLL-3266](https://calmisland.atlassian.net/browse/KLL-3266) ([3715223](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/37152231862469bbd36d57fa5ca0f070eca6f793))
* student can't preview file after attached ([ff5e9dd](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ff5e9dd8e192c3029d2c4e326a11bf54defa5d0c)), closes [KLL-3011](https://calmisland.atlassian.net/browse/KLL-3011)

## [5.0.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v5.0.0%0Dv4.3.0) (2022-03-10)


### ⚠ BREAKING CHANGES

* implementation of new  sfu2 solution

### Features

* implementation of new  sfu2 solution ([1239113](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/12391135cd10203babb8df6e9fd707eb38d469bc))

## [4.3.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v4.3.0%0Dv4.2.0) (2022-03-08)


### Features

* re-design study activity ([ebfff39](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ebfff3989c0c942a7f920b6979086d558e255617)), closes [feat/KLL-2786](https://calmisland.atlassian.net/browse/KLL-2786)
* remove participant tab for student role ([f7df964](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f7df9648b3148f0294d01248c1c7866f95ab0e47)), closes [feat/KLL-2640](https://calmisland.atlassian.net/browse/KLL-2640) [feat/KLL-2640](https://calmisland.atlassian.net/browse/KLL-2640)
* remove quitting logic ([ab8eb23](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ab8eb2363b737eb76b02fcfec473b69e3e8233b3)), closes [KLL-2318](https://calmisland.atlassian.net/browse/KLL-2318)


### Bug Fixes

* add version to record script to prevent cache issue ([92362d5](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/92362d5416cb77986b6e68840065bb1c77a53f99))
* keyboard hides comment field in feedback screen ([1ff6da9](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1ff6da9f33b8054fdb1280f9ab5a37e87bad94b6)), closes [fix/KLL-2438](https://calmisland.atlassian.net/browse/KLL-2438)
* load record script on iframe finished loading ([99b0a96](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/99b0a96f7374a159011d7d061ed00849f805088f))
* scroll in the view (from  4.2.0-hotfix.3) ([49cd936](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/49cd93682c3f23d4405cb3b0b670d6408c859728))


### Refactor

* <Loading/> component ([934a30e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/934a30eb2769016617516fea08de3cde3b6e90c8))
* use <ButtonBase/> for toolbar item ([1808a6a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1808a6a8bf00f8497502b6284f29f9f325d71799))

## [4.2.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v4.2.0%0Dv4.1.0) (2022-02-23)


### Features

* **localization:** add new translations (loading messages) ([e316dd2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e316dd24dc7eeb385e3fa3134292d4b2c97c171f))
* **localization:** add new translations (loading translations) ([64db1a8](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/64db1a8480992bdb2b2443a3892c03bd06f77674))
* show audio player for student [KLL-2639](https://calmisland.atlassian.net/browse/KLL-2639) ([ed5b65e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ed5b65e41f41168dd8e9ad7e0f29cfa6a441bb55))


### Bug Fixes

* improved canvas resizing and scaling ([41ec77f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/41ec77ff1d591ba31b5d3b7c60a559c2559145ac)), closes [KLL-2849](https://calmisland.atlassian.net/browse/KLL-2849)
* prevent iOS asking mic/camera permissions twice ([1a1a636](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1a1a636faeeb46311b6c3094aebdbe404112b554)), closes [KLL-1948](https://calmisland.atlassian.net/browse/KLL-1948)
* skip initial frame to prevent black thumbnail ([7d7f3c2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7d7f3c23a5c54b3e6bc2367f5f7568a8ddab1d3b)), closes [KLL-2431](https://calmisland.atlassian.net/browse/KLL-2431)

## [4.1.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v4.1.0%0Dv4.0.0) (2022-02-16)


### Features

* **localization:** add new translations (App) ([ae67691](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ae67691a38eeb9b8d6d5f90d738d226cb2ce407e))
* **localization:** add new translations (web) ([646d375](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/646d375771322118d6a8ed4c9b9349206b19c693))
* show View Feedback button and hide buttons in HFS for Completed Assessment ([81d9297](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/81d9297c74ca21b8d2d34dd0e3e8ae99886b58f8)), closes [bugfix/KLL-2369](https://calmisland.atlassian.net/browse/KLL-2369) [feat/KLL-2369](https://calmisland.atlassian.net/browse/KLL-2369) [KLL-2369](https://calmisland.atlassian.net/browse/KLL-2369)


### Bug Fixes

* enable preview when selecting file name ([d53fb18](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d53fb18cd05fff918130f63586ab5a79bc244c31)), closes [fix/KLL-2522](https://calmisland.atlassian.net/browse/KLL-2522)
* remove unnecessary if condition ([55df5e2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/55df5e27c392756f92e14183bab8f0955c8f11fb))
* skip fullsnapshot build in h5p videos ([48504d7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/48504d7f454da3ae46cabcce770c848d3f0f543a))
* transparent list items background on iOS ([e3ec293](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e3ec2931572352eb99e631ef2b1f943cc6bfa4ac)), closes [fix/KLL-2853](https://calmisland.atlassian.net/browse/KLL-2853)
* trophy only for student ([1f32928](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1f3292827b67cb80a8a0cf296e4db2d68ad3727e)), closes [fix/KLL-2489](https://calmisland.atlassian.net/browse/KLL-2489) [KLL-2489](https://calmisland.atlassian.net/browse/KLL-2489)

## [4.0.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v4.0.0%0Dv3.11.0) (2022-02-10)


### ⚠ BREAKING CHANGES

* **api:** pack and unpack rrweb event to reduce data size

### Features

* add x option to study activity ([320b2dd](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/320b2dd26b40fcc4fa4144bc2b04730c7bbf0c04)), closes [KLL-2230](https://calmisland.atlassian.net/browse/KLL-2230)
* **api:** pack and unpack rrweb event to reduce data size ([c6ab282](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c6ab2827b75cf2fa91fb3c1c252d7723f18a0dec))
* change the observe warning popup to snackback [KLL-1940](https://calmisland.atlassian.net/browse/KLL-1940) ([d45c4d5](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d45c4d5df09283f404d1edceff4e1c7b0f105604))
* create and display landing page ([decc25a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/decc25a04619c82f2f11788da1408de120159e16)), closes [KLL-2227](https://calmisland.atlassian.net/browse/KLL-2227)
* display teachers feedback on hfs screen ([abdb8d9](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/abdb8d98e328b7651efb3ea91804241ef5f37d91)), closes [KLL-2369](https://calmisland.atlassian.net/browse/KLL-2369)
* enable file preview when selecting file name on home fun study screen ([6971185](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6971185afe1d3c4120121ae2e95b07b18b4e17f2)), closes [KLL-2522](https://calmisland.atlassian.net/browse/KLL-2522)
* improve canvas toolbar ([1704729](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/170472910d48be299d77fe9e0b98ec4fdcc6424f)), closes [KLL-2359](https://calmisland.atlassian.net/browse/KLL-2359) [KLL-2362](https://calmisland.atlassian.net/browse/KLL-2362) [KLL-2358](https://calmisland.atlassian.net/browse/KLL-2358) [KLL-2359](https://calmisland.atlassian.net/browse/KLL-2359) [KLL-2362](https://calmisland.atlassian.net/browse/KLL-2362)
* use canvas colors as drawing cursor [KLL-2488](https://calmisland.atlassian.net/browse/KLL-2488) ([90557fd](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/90557fd02cd2e00f35dd993eb90b697f7a97a6fb))


### Bug Fixes

* change detect disabled share screen button using getDisplayMedia ([d484413](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d484413d395bbdb38ef84bdc524d1e606dc13762)), closes [KLL-2040](https://calmisland.atlassian.net/browse/KLL-2040)
* icons overlapping cameras ([c35113b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c35113bacaf0b56580a32d8ec3bedbcb266567d4)), closes [KLL-2774](https://calmisland.atlassian.net/browse/KLL-2774)
* implement stable-id and additional attribute for mic and cam ([d50dfb8](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d50dfb895ae5e6e9032514cc606a2c42d235a693)), closes [KLL-2656](https://calmisland.atlassian.net/browse/KLL-2656)
* interactive video display white box ([17ae212](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/17ae2124193722a31bb4544ae180bd6b3b667081)), closes [KLL-2425](https://calmisland.atlassian.net/browse/KLL-2425)
* overlap status bar on ipad ([4aa72d0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4aa72d05957b17155358e85e35842bdbda248749)), closes [KLL-2332](https://calmisland.atlassian.net/browse/KLL-2332)
* **rrweb:** disable fullsnapshot for youtube videos ([10abd35](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/10abd35a56a75ad3078453b36ea0e84568ca8f15))
* **rrweb:** make transparent wrong drawings from student in FindWord activity ([f19be8d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f19be8decb8f1326e03f67ab02f4c3d4ba1085d1)), closes [KLL-1879](https://calmisland.atlassian.net/browse/KLL-1879)
* **rrweb:** set default src value to rrweb iframe ([50115a2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/50115a2a1f84b86817f68df5b5c7ce5c56edac10)), closes [KLL-1949](https://calmisland.atlassian.net/browse/KLL-1949)
* **rrweb:** set option to play animation ([a49d69d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a49d69d2d4b6fc9c1262ec080a5079043903bdc4)), closes [KLL-1357](https://calmisland.atlassian.net/browse/KLL-1357)
* stable id for camera stream element and global action menu item ([fccd443](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/fccd443f65598dde528de8f33f2fcec1218d42c0)), closes [KLL-2706](https://calmisland.atlassian.net/browse/KLL-2706)
* the application is using the camera even when it is turned off ([7dc1772](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7dc1772e372658411328baacbe534449d0103da0)), closes [KLL-1218](https://calmisland.atlassian.net/browse/KLL-1218)
* update tooltip for button in live class ([9158d9f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9158d9f98c6f1851164c4f6b713636938b4d9a11)), closes [KLL-1957](https://calmisland.atlassian.net/browse/KLL-1957)
* use callback for hfs score ([5393ed1](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5393ed106f6d31b44674436338d616610b84f412)), closes [KLL-2369](https://calmisland.atlassian.net/browse/KLL-2369)


### Refactor

* split home fun study into components ([6d30bbe](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6d30bbea7dac8d66c5754fa86adc32079f1fdc32)), closes [KLL-2204](https://calmisland.atlassian.net/browse/KLL-2204) [KLL-2204](https://calmisland.atlassian.net/browse/KLL-2204) [KLL-2204](https://calmisland.atlassian.net/browse/KLL-2204) [KLL-2204](https://calmisland.atlassian.net/browse/KLL-2204) [KLL-2204](https://calmisland.atlassian.net/browse/KLL-2204)

## [3.11.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.11.0%0Dv3.10.0) (2022-01-26)


### Features

* improve chat window scrolling and detect android keyboard ([59c3f5a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/59c3f5a407e60874308d1eb145c954902b818011)), closes [KLL-1709](https://calmisland.atlassian.net/browse/KLL-1709)


### Bug Fixes

* can not load flashcard activity on production ([40b3aa2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/40b3aa2bf2e0e4eb1f07caf806fe723805500cce)), closes [KLL-2627](https://calmisland.atlassian.net/browse/KLL-2627)
* correct region id's for beta regions ([b54798a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b54798a163a813b0ad2129547949d6525198b4ec))
* show alert message in mobile browser for both desktop view and mobile view ([cd6f4d9](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/cd6f4d9cb380469db07fcc5539dd951528b69174)), closes [KLL-2040](https://calmisland.atlassian.net/browse/KLL-2040)

## [3.10.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.10.0%0Dv3.9.1) (2022-01-20)


### Features

* refactor alert popper in view mode menu ([6debb53](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6debb5339800009d18c9d218c3af0fed03cabd00)), closes [KLL-2454](https://calmisland.atlassian.net/browse/KLL-2454) [KLL-2040](https://calmisland.atlassian.net/browse/KLL-2040)


### Bug Fixes

* all users gets kicked out with error when Student from App leaves Live class ([3f300ad](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3f300ad7007a9edc36aa25ac16ee0e2cea287418)), closes [KLL-2442](https://calmisland.atlassian.net/browse/KLL-2442)
* **app:** screen stays in landscape mode if user exit from Camera/Mic setup page by Android Back key ([9e6c439](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9e6c439758165e82e794e2b68caf9ddac4c7875e)), closes [KLL-2089](https://calmisland.atlassian.net/browse/KLL-2089)
* **app:** the schedule is not displayed correctly when student changes to another profile ([88f02ef](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/88f02ef699a2ceaec4bd37da76eb21ee9facaf33)), closes [KLL-2308](https://calmisland.atlassian.net/browse/KLL-2308)
* **app:** users get logged out when they login then restart app ([d776de7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d776de7e1e85dddff1a93ed5d44dc58006c2102e)), closes [KLL-2192](https://calmisland.atlassian.net/browse/KLL-2192)
* borderRadius for Safari cameras + camera default bg ([14b88ae](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/14b88ae410d83a273be826c124ee93de020a0fec))
* center audio player ([f59a451](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f59a45177144580535466897349c6fc32d569210)), closes [KLL-1915](https://calmisland.atlassian.net/browse/KLL-1915)
* replace 'Assessment Complete' status with indicator for teacher's feedback ([37f9700](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/37f97002e4a6e5793f1735084c551f21eb89df9e)), closes [KLL-1896](https://calmisland.atlassian.net/browse/KLL-1896)
* replace logo icon with KidsLoop logo in live class the app header ([6154fb3](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6154fb37a1a9603591a64e81b2a8bd2e39e5b923)), closes [KLL-2345](https://calmisland.atlassian.net/browse/KLL-2345)
* the distance number on parental lock screen is too far ([882d933](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/882d93342fd0d7f94e8adc2a53bebdb4b3c74a8a)), closes [KLL-2422](https://calmisland.atlassian.net/browse/KLL-2422)
* the teacher can not see the class detail in Live Class ([34119d9](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/34119d95649557914ecce0e4fc2061515bf55239)), closes [KLL-2451](https://calmisland.atlassian.net/browse/KLL-2451)
* The version number should not show in the settingspage ([8d1eb8a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8d1eb8a50d146196f51b87097a433d3054a1cefc)), closes [KLL-2515](https://calmisland.atlassian.net/browse/KLL-2515)
* updated leave class icon ([c99cbe8](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c99cbe877853d03cf181139ac19fcf514857ba63)), closes [KLL-1947](https://calmisland.atlassian.net/browse/KLL-1947)

### [3.9.1](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.9.1%0Dv3.9.0) (2022-01-10)


### Bug Fixes

* no profile selected when relaunching app ([106bca0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/106bca0eb610d2db03d2ad05d75516cc81ddf611)), closes [KLL-2496](https://calmisland.atlassian.net/browse/KLL-2496)

## [3.9.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.9.0%0Dv3.8.2) (2022-01-07)


### Features

* updated icons ([f80d6f2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f80d6f2cb6a0067c7589aea53340d84f0a96f7fd)), closes [KLL-2429](https://calmisland.atlassian.net/browse/KLL-2429)


### Bug Fixes

* add scroll in mainViewContainer (observe mode breaks layout toolbar bottom) ([e8170fc](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e8170fc5ed9c3c02f4e41dab1baa5e9b04906269))
* android minimum sdk version set to 26 (8.0) ([4ebe96f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4ebe96f1137ed8fc5c1cd68509a2bb4d52affec1)), closes [KLL-2490](https://calmisland.atlassian.net/browse/KLL-2490)
* remove duplicated profiles ([544d439](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/544d43956a2d9b435d167faf578a5d3ab80d1317)), closes [KLL-2496](https://calmisland.atlassian.net/browse/KLL-2496)
* scroll bar UI is broken in schedule page on iOS ([d9eae1c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d9eae1ccd11e86571caffbae9b227e1ca8ba68a8)), closes [fix/KLL-2423](https://calmisland.atlassian.net/browse/KLL-2423)

### [3.8.2](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.8.2%0Dv3.8.1) (2022-01-06)


### Bug Fixes

* add missing feature field for pakistan region ([0484d04](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/0484d04e01ac32360254c776b41ce8b83d7345e8))

### [3.8.1](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.8.1%0Dv3.8.0) (2022-01-06)


### Bug Fixes

* add region definition for Pakistan ([dedea93](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/dedea936bf42f0d8c99ebdc5fe8d07958dac457a)), closes [KLL-2452](https://calmisland.atlassian.net/browse/KLL-2452)

## [3.8.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.8.0%0Dv3.8.0-internal.2) (2022-01-06)


### Features

* add gallery option and enable access for android ([28af4c4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/28af4c4181aa7f750b13d7b098389c1bbd59eab8)), closes [KLL-1410](https://calmisland.atlassian.net/browse/KLL-1410)
* inform teacher unsupported screen ([defabef](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/defabef612ecd40b5fd67c61ca1842674d392af5)), closes [feat/KLL-2040](https://calmisland.atlassian.net/browse/KLL-2040)
* settings and selectLanguage as Pages ([297893d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/297893dea702760fc0ad4b13659dc81fd1cfd932)), closes [KLL-2209](https://calmisland.atlassian.net/browse/KLL-2209) [KLL-2208](https://calmisland.atlassian.net/browse/KLL-2208)


### Bug Fixes

* add SSO region definition ([da0adbe](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/da0adbe7059bf15a0ddd18b2b8d17d8f120ca7da))
* **app:** add pop-up to inform users about limitations with specific iOS versions ([af4d8a4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/af4d8a4702a575699b4167f28bfd1b6497e60e50)), closes [KLL-1917](https://calmisland.atlassian.net/browse/KLL-1917)
* check if exist before mute video on Observe Mode ([07424c8](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/07424c8b76e43a1cdaa91518de687c245d8e3bb7))
* observe warning popup ([84f5d55](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/84f5d55fd180d6eed35758e5ceb5493275131683)), closes [KLL-2432](https://calmisland.atlassian.net/browse/KLL-2432)
* parental lock screen is not displayed when user tap on hyperlink in anytime study ([2425229](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/24252295a84a1f4d70a8371dc9ce1703ceb56f54)), closes [fix/KLL-2342](https://calmisland.atlassian.net/browse/KLL-2342)
* parentalGate image to cover the sides of round rect ([4af90e6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4af90e67604e7511b3d04de54ee092d6c8bb4524))

## [3.8.0-internal.2](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.8.0-internal.2%0Dv3.8.0-internal.1) (2021-12-30)


### Bug Fixes

* don't automatically redirect after sign in ([11396bc](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/11396bc0c38ba51c684b93dd8b4de3cfb261da76))
* package-lock correct version of kidsloop-live-state ([720fe2a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/720fe2af9af59e6ad086f852b55db58938da6119))
* use kidsloop-live-state 1.0.4-es2017 release ([cb5a352](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/cb5a352edf426077609d2206f1e078a16931a466))

## [3.8.0-internal.1](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.8.0-internal.1%0Dv3.8.0-internal.0) (2021-12-30)


### Features

* add resize listener h5p [KLL-2339](https://calmisland.atlassian.net/browse/KLL-2339) ([07cf48c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/07cf48cf2ef67e2e401223f7345836d1d7fe483d))
* **app:** show denied speech recognition message ([583898b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/583898bc15899b1946cdceffb93e46045f553bb8)), closes [KLL-2392](https://calmisland.atlassian.net/browse/KLL-2392)
* create display hamburger menu ([1fbebf3](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1fbebf340d0ea8658c22b1c9190ec792888df8f0)), closes [KLL-2344](https://calmisland.atlassian.net/browse/KLL-2344) [KLL-2233](https://calmisland.atlassian.net/browse/KLL-2233) [KLL-2343](https://calmisland.atlassian.net/browse/KLL-2343)


### Bug Fixes

* better design schedule details ([27685b4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/27685b41fc8ebf3ef5941cbc05cc1f7da8205a4f))
* handle show image in parental lock by layout mode instead orientation ([ec63b2d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ec63b2dfec6a2b0675490c5309d1f986ba5069f0)), closes [KLL-2150](https://calmisland.atlassian.net/browse/KLL-2150)
* **hfs:** can't upload pdf files ([863577a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/863577a9dd40a725ac724269e261e8b6807c5a1e)), closes [KLL-2420](https://calmisland.atlassian.net/browse/KLL-2420)
* improve the canvas clearing functionality ([2856a0b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/2856a0b6a0099333d8e1a221d57f1b3455435b7d)), closes [KLL-2069](https://calmisland.atlassian.net/browse/KLL-2069)
* improving observe in viewport feature ([3ecd32c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3ecd32cdbd2d3441cf05b389eabfa8ff8ff9d662)), closes [KLL-2222](https://calmisland.atlassian.net/browse/KLL-2222)
* missing translation for anytime study ([0e23066](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/0e23066b65a00b725a6e2d5e00f250f64f7095f5))
* remove n/a when load schedule dialog ([8f1aacd](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8f1aacdff826e60c35038e8da4d2a035b33d6442)), closes [KLL-2063](https://calmisland.atlassian.net/browse/KLL-2063)
* update schedule design ([ba6fc2c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ba6fc2cd68771189a8492a12af2005ae3ebaec8c)), closes [Feat/KLL-2346](https://calmisland.atlassian.net/browse/KLL-2346) [KLL-2346](https://calmisland.atlassian.net/browse/KLL-2346)

## [3.8.0-internal.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.8.0-internal.0%0Dv3.7.0) (2021-12-28)


### Features

* add loading indicator for a schedule ([f752f56](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f752f56e2274b761ec073fe76ce2a49c92f9acb4)), closes [KLL-2063](https://calmisland.atlassian.net/browse/KLL-2063)
* add new user_id cookie for h5p ([3e93597](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3e93597b6fa8dc8d38aa6b50cb8ae01751d1b7c0)), closes [KLL-2211](https://calmisland.atlassian.net/browse/KLL-2211) [KLL-2211](https://calmisland.atlassian.net/browse/KLL-2211)
* display error message when downloading with network problem ([d71622c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d71622c5b28906d5c2e0fdb85ebcdd876641a743)), closes [KLL-1942](https://calmisland.atlassian.net/browse/KLL-1942)
* display student-only profiles when sign in ([e96b824](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e96b824f8e92db33998225b02dca8f5f286bed6e)), closes [KLL-1939](https://calmisland.atlassian.net/browse/KLL-1939)
* implement mechanism for parent lock screen ([22120ec](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/22120ec2977eb2ed51977fe9253405f80ba07d7c)), closes [KLL-2150](https://calmisland.atlassian.net/browse/KLL-2150)
* **localization:** add new translations ([2c41299](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/2c41299548ada24f1a72243cbd65da322ed0b6f2))
* observe students in viewport ([7a26ff6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7a26ff60230b141c0a358f6cd6377a336a78d0e1)), closes [KLL-2222](https://calmisland.atlassian.net/browse/KLL-2222)
* update pages when there is no Live/Study schedule ([631beaf](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/631beafde5adee63d911f664675b7e0a36ac10c0)), closes [KLL-2348](https://calmisland.atlassian.net/browse/KLL-2348)
* update schedule design ([a9927c7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a9927c7e5ba8671b30d88362f62e1ee29d98f537)), closes [KLL-2346](https://calmisland.atlassian.net/browse/KLL-2346)


### Bug Fixes

* add translation app version ([d67718b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d67718b06507c6c71b21bebbfab35db2377d229e)), closes [KLL-2198](https://calmisland.atlassian.net/browse/KLL-2198)
* custom padding to fit the UI design ([aa8aa99](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/aa8aa99d59d4fbe36c6a5f2a202b8910b357020b)), closes [KLL-2346](https://calmisland.atlassian.net/browse/KLL-2346)
* es language is not working in WEB ([3db9af2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3db9af2f5c28d7a4f7bad56fd43125cd46ae451d)), closes [KLL-2319](https://calmisland.atlassian.net/browse/KLL-2319)
* remove unwanted loading screens [KLL-2194](https://calmisland.atlassian.net/browse/KLL-2194) ([dc5e72c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/dc5e72cc6f4edfbe986e849ef140945d7eeb8d84))
* reposition X icon on feedback screen ([4c19480](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4c19480e9d18340a2ed09ea8bf2edad47f9c2669)), closes [KLL-2073](https://calmisland.atlassian.net/browse/KLL-2073)
* reposition X icon on feedback screen ([0fb075d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/0fb075d86d218f55a61402f6e08ac43ade727b45)), closes [KLL-2073](https://calmisland.atlassian.net/browse/KLL-2073)
* resume from background invalidate mute in Live class ([33b015f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/33b015f5ed79a3be0c03faa30c86cdd7953d7fdf)), closes [KLL-1964](https://calmisland.atlassian.net/browse/KLL-1964)
* setWaitTimeout while upload events ([97144fc](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/97144fc7171da53eb49207bcd81132eeef534c96)), closes [KLL-2304](https://calmisland.atlassian.net/browse/KLL-2304)
* smoother style parentalGate ([fe15ef1](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/fe15ef1478592ccd2700360d7e160c05f5189d30))
* stop sendEventHandler when class type is STUDY ([dd23135](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/dd2313516c6830b58978125522cc3ca90b1439e9)), closes [KLL-1812](https://calmisland.atlassian.net/browse/KLL-1812)

## [3.7.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.7.0%0Dv3.6.1-internal.0) (2021-12-15)


### Features

* add app version to settings page ([79ad226](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/79ad2262d7f91ea6fa2ce7c20f606b940ff41c35)), closes [feature/KLL-2198](https://calmisland.atlassian.net/browse/KLL-2198)
* **localization:** add new translations ([2b03ef4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/2b03ef4647b1659b72871542195c113e43ccced0))
* update design of icons on schedule list ([aaceabb](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/aaceabb9a055a5d40854b6983d7501e012cafd42)), closes [feat/KLL-1895](https://calmisland.atlassian.net/browse/KLL-1895)


### Bug Fixes

* don't display no org dialog when there's one profile ([122b817](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/122b817159f65092aaaed893825bcf1305d3c941))
* issue with white screen in study ([dc1dcc5](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/dc1dcc57f76d276ee2b7f6036c41ad373174eec3))

### [3.6.1-internal.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.6.1-internal.0%0Dv3.6.0) (2021-12-14)


### Bug Fixes

* detect read plugin network connection type only for android ([6c040e1](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6c040e13191b0c0cc31b177fb004dfd70b2838c0)), closes [fix/KLL-1967](https://calmisland.atlassian.net/browse/KLL-1967)

## [3.6.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.6.0%0Dv3.5.2-hotfix.0) (2021-12-13)


### Features

* add ScreenShare as view mode ([0c8b83b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/0c8b83b67ba7de00cf3045eba778d71f7a4b92f1)), closes [feature/KLL-1928](https://calmisland.atlassian.net/browse/KLL-1928) [Feature/KLL-1928](https://calmisland.atlassian.net/browse/KLL-1928) [KLL-2200](https://calmisland.atlassian.net/browse/KLL-2200) [KLL-2201](https://calmisland.atlassian.net/browse/KLL-2201) [KLL-2203](https://calmisland.atlassian.net/browse/KLL-2203)
* remove message, content button in live class ([8e05487](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8e0548742ba62d26ffbf9c3041a4e08d9ed28b0a)), closes [feat/KLL-1941](https://calmisland.atlassian.net/browse/KLL-1941)


### Bug Fixes

* add fallback value to student and teacher roster data fields ([f94592d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f94592d30bf4709fcb8892dab61a8b24c99586a5))
* hide splash screen after user quits room ([efbbf2c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/efbbf2c5838a5ff8c8c519517d23d0d0c9807be4)), closes [fix/KLL-1793](https://calmisland.atlassian.net/browse/KLL-1793)
* privacy notice page url ([ae4c84b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ae4c84bab563d1cad0e8b59b57fe88132dc7cdfb)), closes [KLL-2306](https://calmisland.atlassian.net/browse/KLL-2306)
* screen gets upside down regardless of user's screen orientation when user go into Live/Study ([9ceab80](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9ceab80e6d0de480a4ac70a9f93c4224ac0bf3fb)), closes [fix/KLL-340](https://calmisland.atlassian.net/browse/KLL-340)
* speech recognition doesn't work after retry ([50127e6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/50127e67e72d00ff60bc4ec1cafc23ac80561d63)), closes [bugfix/KLL-2282](https://calmisland.atlassian.net/browse/KLL-2282) [Bugfix/KLL-2282](https://calmisland.atlassian.net/browse/KLL-2282) [KLL-2282](https://calmisland.atlassian.net/browse/KLL-2282)

## [3.6.0-internal.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.6.0-internal.0%0Dv3.5.1) (2021-12-08)


### Features

* add no organization found page ([891c554](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/891c5541528a8fe4bc200a483ffb72828947b136)), closes [KLL-2130](https://calmisland.atlassian.net/browse/KLL-2130) [KLL-2130](https://calmisland.atlassian.net/browse/KLL-2130) [KLL-1696](https://calmisland.atlassian.net/browse/KLL-1696)
* automated schedule list refetch when submitting home fun study ([c552f6e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c552f6e666db5b764c90ec244cd2b3bd87a4c841)), closes [fix/KLL-2162](https://calmisland.atlassian.net/browse/KLL-2162) [KLL-2162](https://calmisland.atlassian.net/browse/KLL-2162)
* **localization:** add new translations ([73ca556](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/73ca556e670233391ee5d4cf7695f57df0071dbf))


### Bug Fixes

* **app:** app gets frozen after the Speech Recognition on iOS ([25ba420](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/25ba420bb07f7598cabb3b65813a0fb38c4ae45d)), closes [KLL-2121](https://calmisland.atlassian.net/browse/KLL-2121)
* **app:** implement android back button for study class ([1b538a7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1b538a70dcdf9a5ecf48ccdaf63d186890078d7b)), closes [KLL-1844](https://calmisland.atlassian.net/browse/KLL-1844)
* **app:** remove grey splashscreen ([d30f70f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d30f70f0cb6bd5fed37b22f3e4778ca62387fabd)), closes [KLL-1793](https://calmisland.atlassian.net/browse/KLL-1793)
* don't add the youtube API to the page multiple times ([c2c8189](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c2c81892b05fce88973986169fc64b0950f50e11))
* find words activity appeared to be stored in Observe mode ([7062f8e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7062f8e2e2968b4807c9ab6f1767b67d87769e07)), closes [KLL-1879](https://calmisland.atlassian.net/browse/KLL-1879)
* **localization:** change translation keys ([1dd7c68](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1dd7c680ab2c97d24cb578a822dc3c07b9866f0f))
* only some of the supported files can be selected from google drive ([d14c051](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d14c05183ec468a9582e895c74ca55808e4b5689)), closes [KLL-1788](https://calmisland.atlassian.net/browse/KLL-1788)
* reduce logo size on splash screen ([35044d5](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/35044d5403a550cd67ccc9415cd8dd034846f2ef)), closes [KLL-1793](https://calmisland.atlassian.net/browse/KLL-1793)
* resume from background invalidate mute in Live class ([94e9b87](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/94e9b871d9d0cae47c1c3d3c1eec4a0b0ac716e6)), closes [KLL-1964](https://calmisland.atlassian.net/browse/KLL-1964)
* student receives end Class event when they switches from Cellular to WiFi ([214d24b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/214d24be6a702a9fc66754d9a1945b32ca263fa8)), closes [KLL-1967](https://calmisland.atlassian.net/browse/KLL-1967)

## [3.6.0-internal.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.6.0-internal.0%0Dv3.5.1) (2021-12-08)


### Features

* add no organization found page ([891c554](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/891c5541528a8fe4bc200a483ffb72828947b136)), closes [KLL-2130](https://calmisland.atlassian.net/browse/KLL-2130) [KLL-2130](https://calmisland.atlassian.net/browse/KLL-2130) [KLL-1696](https://calmisland.atlassian.net/browse/KLL-1696)
* automated schedule list refetch when submitting home fun study ([c552f6e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c552f6e666db5b764c90ec244cd2b3bd87a4c841)), closes [fix/KLL-2162](https://calmisland.atlassian.net/browse/KLL-2162) [KLL-2162](https://calmisland.atlassian.net/browse/KLL-2162)
* **localization:** add new translations ([73ca556](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/73ca556e670233391ee5d4cf7695f57df0071dbf))


### Bug Fixes

* **app:** app gets frozen after the Speech Recognition on iOS ([25ba420](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/25ba420bb07f7598cabb3b65813a0fb38c4ae45d)), closes [KLL-2121](https://calmisland.atlassian.net/browse/KLL-2121)
* **app:** implement android back button for study class ([1b538a7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1b538a70dcdf9a5ecf48ccdaf63d186890078d7b)), closes [KLL-1844](https://calmisland.atlassian.net/browse/KLL-1844)
* **app:** remove grey splashscreen ([d30f70f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d30f70f0cb6bd5fed37b22f3e4778ca62387fabd)), closes [KLL-1793](https://calmisland.atlassian.net/browse/KLL-1793)
* don't add the youtube API to the page multiple times ([c2c8189](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c2c81892b05fce88973986169fc64b0950f50e11))
* find words activity appeared to be stored in Observe mode ([7062f8e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7062f8e2e2968b4807c9ab6f1767b67d87769e07)), closes [KLL-1879](https://calmisland.atlassian.net/browse/KLL-1879)
* **localization:** change translation keys ([1dd7c68](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1dd7c680ab2c97d24cb578a822dc3c07b9866f0f))
* only some of the supported files can be selected from google drive ([d14c051](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d14c05183ec468a9582e895c74ca55808e4b5689)), closes [KLL-1788](https://calmisland.atlassian.net/browse/KLL-1788)
* reduce logo size on splash screen ([35044d5](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/35044d5403a550cd67ccc9415cd8dd034846f2ef)), closes [KLL-1793](https://calmisland.atlassian.net/browse/KLL-1793)
* resume from background invalidate mute in Live class ([94e9b87](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/94e9b871d9d0cae47c1c3d3c1eec4a0b0ac716e6)), closes [KLL-1964](https://calmisland.atlassian.net/browse/KLL-1964)
* student receives end Class event when they switches from Cellular to WiFi ([214d24b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/214d24be6a702a9fc66754d9a1945b32ca263fa8)), closes [KLL-1967](https://calmisland.atlassian.net/browse/KLL-1967)

### [3.5.1](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.5.1%0Dv3.5.0) (2021-12-02)


### Bug Fixes

* fix splash screen doesn't show on android device ([4780519](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/47805199d2be03c611b43751ded1dc73d49de669)), closes [fix/KLL-1793](https://calmisland.atlassian.net/browse/KLL-1793) [KLL-1793](https://calmisland.atlassian.net/browse/KLL-1793)
* remove recursive effect setState behavior ([a91ca8a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a91ca8aa63db245ea5554b0f8704618fa68e4c30))
* status bar hidden when dark mode ([fe3a6ab](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/fe3a6aba029a912c0eee0348b89729a071154193)), closes [fix/KLL-1679](https://calmisland.atlassian.net/browse/KLL-1679)

## [3.5.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.5.0%0Dv3.4.0) (2021-12-01)


### Features

* make android back button behave same as 'X' icon ([f34808d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f34808d90aecc22fbba5f6d1131a3e3ea1648a27)), closes [feature/KLL-1834](https://calmisland.atlassian.net/browse/KLL-1834) [KLL-1834](https://calmisland.atlassian.net/browse/KLL-1834)


### Bug Fixes

* hide scrollbar cross-browser for live + style for study and class ([b86f638](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b86f63834451af07f752ba0547716a338ceb0a5c)), closes [fix/KLL-1935](https://calmisland.atlassian.net/browse/KLL-1935) [KLL-1935](https://calmisland.atlassian.net/browse/KLL-1935)
* remove notice parents title ([3114499](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/31144999f2149dc2c5393df4623bd38211483f83))
* use correct auth endpoint in record ([74a4bcc](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/74a4bcc0302fd69f90c5ada542e85db29b78d738))

## [3.4.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.4.0%0Dv3.3.2) (2021-11-30)


### Features

* fetch amount of items depending screen size ([e329bab](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e329babff28aae5e3fbb473938e9953733a2875e))
* **localization:** added new translations and updated some existing ones as well ([671fdd4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/671fdd4a480d275765965d4d583de4169518175c)), closes [#643](https://calmisland.atlassian.net/browse/643)


### Bug Fixes

* correctly show bottom action bar ([f6dc1dd](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f6dc1dd5a27ed220fc516e7ef1db5763d4829785)), closes [#652](https://calmisland.atlassian.net/browse/652)
* injectIframeScript only on mobile ([596f972](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/596f972b19fe900fcbae2a4658e3ef6e68a6b47c))
* refresh the first schedule pagination page when refocusing the app ([8a9337c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8a9337c6ad3c93a8a22b5ab8a602422f3b8561d3)), closes [fix/KLL-2137](https://calmisland.atlassian.net/browse/2137) [#653](https://calmisland.atlassian.net/browse/653) [KLL-2137](https://calmisland.atlassian.net/browse/2137) [fix/KLL-2137](https://calmisland.atlassian.net/browse/2137)
* remove scrollbar from activity (h5p/pdf) ([18fbfd5](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/18fbfd56544764e961f7854adc89658ece8ed280)), closes [KLL-1935](https://calmisland.atlassian.net/browse/1935)
* remove useDoubleSize for column activity [KLL-1858](https://calmisland.atlassian.net/browse/1858) ([bfd1c87](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/bfd1c87cee0619e003b85d21543a4eff91a0e290))
* update enrolled_participants ([abae41f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/abae41f8efcd5caed70373333ec27da52693fee2)), closes [KLL-1395](https://calmisland.atlassian.net/browse/1395) [KLL-1395](https://calmisland.atlassian.net/browse/1395) [KLL-1395](https://calmisland.atlassian.net/browse/1395) [KLL-1395](https://calmisland.atlassian.net/browse/1395) [KLL-1395](https://calmisland.atlassian.net/browse/1395) [KLL-1395](https://calmisland.atlassian.net/browse/1395) [KLL-1395](https://calmisland.atlassian.net/browse/1395) [KLL-1395](https://calmisland.atlassian.net/browse/1395) [KLL-1395](https://calmisland.atlassian.net/browse/1395)
* use a timer for "Go Live" (schedule details) ([2a78cdc](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/2a78cdc5a28cba0f1623aca6fc45793991cf5210)), closes [fix/KLL-2070](https://calmisland.atlassian.net/browse/2070) [#645](https://calmisland.atlassian.net/browse/645) [KLL-2070](https://calmisland.atlassian.net/browse/2070)
* useDoubleSize for mobile only ([be041d5](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/be041d5fd2bd6855613017488aea88828eb67e0f))

### [3.3.2](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.3.1%0Dv3.3.2) (2021-11-26)


### Bug Fixes

* add thai region ([a7d63ab](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a7d63ab54666e421b1647f25d3cb3de6ad7f3d02)), closes [#636](https://calmisland.atlassian.net/browse/636)
* **app:** hfs is not updated even after the submission ([853b6b7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/853b6b71b26a5476ce2c58926ab0fe6a43bb2205))
* enforce global mute on new joins ([9358998](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/935899856c9b6727e1c9292fb8b347d2b6999535))
* listen ondevicechange only in the join page ([91efd4d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/91efd4d80dc7b25a0c0f7ac3ddb3a399ad5514b7))

### [3.3.1](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.3.0%0Dv3.3.1) (2021-11-25)


### Bug Fixes

* add Sri Lanka and staging region ([8d384fc](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8d384fc604dfe0ddf6c0bb4be379a5afcc0e944d))
* **app:** android back key input repeatedly leads App crash ([5e5566f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5e5566fd02c4b351e847b01826bbc8c2196996bd))
* **entry-player.ts:** only use full snapshot once for h5p ([f8f1978](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f8f1978e6235a2f39b6b7c731ea16672244b52c6))
* image not centered in study ([27523f6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/27523f67ea3066f0dfee4d0217e7a9c0e9224204)), closes [#622](https://calmisland.atlassian.net/browse/622)
* overlapping in find words activity ([03d88e6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/03d88e66be98bba41f2bc7049c6ec6c8bd493946))
* unable to use speech recognition for Android 11 ([462c444](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/462c44412f7573d99be3309353e1b18ca07a7e6d))
* use bold from themeProvider ([978c78f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/978c78f8aa0503a5b357d0afd4fff41f92b85b77))
* wrong sync teacher/student in present mode when there's content to be scrollable ([0767990](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/07679901407d230762ab5df8027f47334d1b380d))

## [3.3.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.2.2%0Dv3.3.0) (2021-11-19)


### Features

* add loading and error screens for grapqh connections ([172e84b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/172e84b06340db84078b8d0e83d56a2ac3eaf68b))
* add locale parameter to auth login ([7c4d49d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7c4d49d876f5e464b3362e58f4d4f79b0ba908c5)), closes [#616](https://calmisland.atlassian.net/browse/616)
* add pagination and other optimizations to schedule page ([5b0ff68](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5b0ff6842e24d4b9540f6090f0c2ee94c55df6fa))
* add region select buttons in development builds ([e5fe1a7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e5fe1a725b11b3e6716609ca5c06774e4b299510))


### Bug Fixes

* adaptive name width in userCamera + remove speaking activity (unused) ([e92d6ce](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e92d6ce2c3d7491417daf1dc262e3c1942833594))
* **app:** camera,mic become malfunction after resume ([cf09feb](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/cf09feb3a5415c38df06c6a61595a7ba8e26416d))
* **app:** unable to use speech recognition in Observe mode ([dee0b90](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/dee0b903fd73cc0ee62064e7c410562686363d6c))
* connect sfu after live is connected ([9b74a80](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9b74a80e461d42b5dba70951ec1f02c068176899))
* don't setState during render ([163c638](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/163c638f7241b6d5a95d14bc024173854a5fc685))
* mp4 file source not loading properly ([ce34174](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ce341749b5acd94dff059afa96a42760ca9050c5))
* remove drag and drop image ([cecdb6a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/cecdb6a305f4ff897829567d2cf9e83138fe89f4))
* separate providers for live and study ([ff9028a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ff9028aa8dc69f51fe548e147b9cab7fe90bcc59))
* use actual cms endpont for recommended content query ([5606c6e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5606c6ea5a25c9fae098fcb39f59441c039cc33a))
* use createStyles at settingDialog.tsx & schedule.tsx ([eae7162](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/eae71627e77ed3e76e9851f81d44dd1298493b09))

### [3.2.2](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.2.1%0Dv3.2.2) (2021-11-15)


### Bug Fixes

* issue on Android 11 where login page opens in system browser ([5b9c5d7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5b9c5d79887a508f1a31b371ee93d5d4ea87d497))

### [3.2.1](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.2.0%0Dv3.2.1) (2021-11-12)


### Bug Fixes

* **app:** camera/mic not work after resume ([23459d2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/23459d2fcd589beec35e9ad5257eef101f8f9d71))
* **app:** flash card unable to use speech recognition on APP ([8a603ac](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8a603ac4e1168d497ee8a3c5812d2267c39cfe05))
* apply background #ffffff to body (prevent the overriding of dark mode on devices) ([87c3656](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/87c365655bebd69661cfc633b4bec7fd6c88eb55))
* **app:** the HFS becomes infinite spinner ([6904c0a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6904c0a8f88b761a4bae9fe4a46e8f2bc6018d8c))
* **app:** unexpected error is thrown when user submit HFS if assessment is completed ([3a7cc51](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3a7cc51d7d27101340e8af42752c46e0f3bd2fa2))
* record pdf content ([bbdc049](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/bbdc049195ba5dd6980b1182c3d21ae765c4ad93))
* teacher can see the last video frame when student's cam muted ([2fbfd1b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/2fbfd1ba176564f71947b571c70af24b9775224b))
* translation typo ([606a9b0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/606a9b013505495445f95b8d7580f8657bbba021))

## [3.2.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.1.0%0Dv3.2.0) (2021-11-05)


### Features

* add new translations ([c4f23c6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c4f23c6c5a72c223afa62ae7ce4195c4a19da73c)), closes [#572](https://calmisland.atlassian.net/browse/572)
* **app:** add setting modal with language select ([da66681](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/da666815f0ae44bd057bb5fb4531cf11251f7dab)), closes [#567](https://calmisland.atlassian.net/browse/567)


### Bug Fixes

* add Safari as exception for refreshCameras on join page ([7f74d4e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7f74d4eec33137bcbaa86adb40c352ab6e5d781f))
* **app:** app saying that no image is selected when cancel Camera in HFS ([5a73258](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5a732588b314a6caa2a9ec3889b41d6d7c893744))
* **app:** status of Home Fun Study is not updated even after the submission ([6da8a6c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6da8a6c9e02e5fca366304c7edf44192b9abc123))
* auto open selectUserDialog if no profile is selected ([c91601f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c91601f2b72591b9d37b83b65357751aaa173234)), closes [#578](https://calmisland.atlassian.net/browse/578)
* dont record pdf content ([a3b24f6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a3b24f6a8120c0d4bec58ecab92a3fb35e7ea0a2))
* **ios:** student can go to youtube without a parental lock ([05bb315](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/05bb315c40b1f7e9a314c7635daa3a58b7f20851))
* remove gtag and missing page icon reference and change html index author ([d8d9bec](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d8d9bec49b25d53a9ed2e1604f099e01c8fa75d0)), closes [#582](https://calmisland.atlassian.net/browse/582)
* safeArea updates on device orientation changes ([9ec73b1](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9ec73b1e1af76cae61bd0e8be58d72edadb0ca5c)), closes [#569](https://calmisland.atlassian.net/browse/569)
* set permissions.allowCreateShapes true when classType is CLASSES ([6dab07c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6dab07cd178fe0901197da222ee51e1eef989809))
* students are not able to use MP3/WAV content on study ([0b07703](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/0b07703b968512cc0d5240dcc3f194b6ce2505ba))
* unable to play non-h5p videos ([386d214](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/386d214d482d2fb20f07c133f1d464e63724d589))
* use apollo client for user api ([6a1b10c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6a1b10cd71890e705182cc10916955f8636da62b))
* user is asked to provide consent to Camera when joining a Study on iOS ([af3944d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/af3944d8d5afb645c6cc62451038f8dea5eabf3f)), closes [#570](https://calmisland.atlassian.net/browse/570)
* user's camera appears as frozen when to turn off/on it quickly ([730c613](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/730c61358e59bd8a14bb43f1e684d493cf0bd55f))

## [3.1.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.1.0-internal.1%0Dv3.1.0) (2021-10-29)


### Bug Fixes

* Can not access functions in callstats ([4d952a0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4d952a089b7550f2ad15b4f7763e06188a60db2a))
* Can not access functions in callstats ([723455d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/723455d9ea881f5da11a0dd0c9a9ed8d9cc38a35))
* confirm close comment popup cannot be dismissed by android back key ([dce6a6c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/dce6a6cdc482e4dc52d0ae819df3fdac150ba01b))
* Disable CALLSTATS ([cac4127](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/cac412750a520ecff900d661dcb3555c5c1d1887))
* height view study 100% ([d5940a0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d5940a05a477ac4c651b3f6eb3ef081cdc6aa941)), closes [#561](https://calmisland.atlassian.net/browse/561)
* update webpack-cli (crash on npm run) ([9a74c8c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9a74c8c39f88814c8fd0edd255551b76bb03824c)), closes [#558](https://calmisland.atlassian.net/browse/558)

## [3.1.0-internal.1](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.1.0-internal.0%0Dv3.1.0-internal.1) (2021-10-27)


### Bug Fixes

* undefined error trying to read send/recv- only field ([19331be](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/19331be229803b5d2aefc94871d5b4c40d5bd86f))

## [3.1.0-internal.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.0.0%0Dv3.1.0-internal.0) (2021-10-27)


### Features

* (app) Use PDF to JPEG ([e33cd6f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e33cd6f87e0b75aa09d3e034e5536ba70a9f2140))
* (web) Use hub language in Live + remove settings panel ([43a8319](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/43a83195a5d1a18dcc5698115d6ba1d9ba7d98dd))
* Add scollbar inside scrollable h5p ([a20ef1e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a20ef1e01c148bdd4db741d7c23ab08bf25df69c))
* Bigger study view ([609b2ef](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/609b2ef4789ac45b2988f2d1f80ba60ac8e2e171))
* Remove close icon if profile is not autoselected ([251c6a0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/251c6a03cae6e6b60a188de0d07ecc8c61aaaaa6))
* Switch to JPEG PDF ([ba8e286](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ba8e286f68919b008a3181caaac56f1b08d011fb))


### Bug Fixes

* add Safe Area for Study view ([b061e8a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b061e8a84e1333fabf9f95860943ca884e8c2edb))
* **app:** Added SupportFileInfo popup into BackQueue ([cb7db2e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/cb7db2e1ae6e9316b075fc4b2053bf983e9052c9))
* Appbar in theme + remove un-needed in commentDialog.tsx ([23267d2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/23267d2889451412641be7a48c0fd681e1158760))
* **app:** Youtube video doesn't play on Cordova in Present Mode ([77016f0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/77016f0667e0de0b1ea85aea3b20de069bebf80c))
* autofocus on iOs (parentalGate) ([172f583](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/172f58340a7e0b4b881481e5301191e816be48c0))
* Generate the canvas size to fit the screen size. ([5c58917](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5c58917c787edda17127f72a6755e5484ae9e112))
* iOs safe area ([053c8e0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/053c8e0ec275f094d4eec846d6e930142d56c383))
* Live class goes white blank ([5764f43](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5764f438cfd7e7b684eef5b105ce2fe2a71e5bee))
* update config files pdf version ([b592e09](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b592e09fa6b591614f7897c1a04218c515fc221d))

## [3.0.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v2.3.0%0Dv3.0.0) (2021-10-22)


### ⚠ BREAKING CHANGES

* **app:** replace redux with recoil for entry-cordova
* **app:** replace redux state with recoil state for hfs
* **app:** replace redux state with recoil state for selectUserDialog
* **app:** replace redux state with recoil state for selectOrgDialog
* **app:** use recoil state in user-information-context
* **app:** use recoil state for region-select-context
* **app:** use recoil state in Header component
* **app:** replace redux state with recoil state for schedule
* added app specific pages, dialogs, components, and utilities.

### Features

* add back button to join page on app ([34881f0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/34881f074cba0056d7ba6a7ddfad31605d5e4289))
* add exit button on app on endClass page (feedback page) ([f00964a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f00964a6181f252e3b655f9f4c0c1e3643d4cfe8))
* Added preview the attachment when touch on the file icon ([800768d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/800768df6d1e83171b37ef26bef5f2185cd2fa36))
* **app:** add loading component with retry button ([a8b3cbd](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a8b3cbd8cf06eb0ad1c657f79f8faf36e470e78c))
* **app:** add new relic logging ([7809bf0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7809bf073a2b2eab0975404bd24a5a63a9340c7c))
* **app:** Get files in directory to generate an unique file name ([7a78697](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7a78697a0b245dfc3a728fec1121da1d42ad5840))
* Enable hyperlink in description for schedule popup ([6d8b7f5](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6d8b7f58196144338d5860707daf850a16015399))
* iOS CORS workaround(native) ([1cc57b4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1cc57b422bd612619a67f1634d9357eb3ab13bfc))
* merge web with app localizations ([a3389d7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a3389d7408699fe055a68d8b40902745d97bca20))
* parentalGate : Auto open keyboard + auto validate if answer is good ([3b1f2cf](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3b1f2cf5add390ef321da8d4d131b8a1bf942c1c))
* Show error message if select camera was failed ([4b451d6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4b451d688b6fbbb1b458fc74b0bb35e4df4755c5))
* **translation:** add thai translations ([9df8e9d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9df8e9d4634b840a561348712fb51fb426cc7fa4)), closes [#529](https://calmisland.atlassian.net/browse/529)
* **translation:** add thai translations ([07ed980](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/07ed98079f5120b4aec45b0d7351159b1f6b5595)), closes [#530](https://calmisland.atlassian.net/browse/530)


### Bug Fixes

* add Dotenv webpack plugin ([7bfd842](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7bfd842d16f0f30c4c3be713ef1a3084aa3245f3))
* add h5p resize entry to webpack config ([4c228d4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4c228d46f5287d57ae3207f007d8d45333dd8dde))
* add missing translations ([9958698](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/995869839ff81a722e0cb5b68da774d7e81b4f21))
* add RecoilRoot for to entry-cordova ([5a9291c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5a9291c2e939ac5361dbe4766c863bc8f84c5db7))
* added app specific pages, dialogs, components, and utilities. ([7d5dbbd](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7d5dbbd6f54ef0b408b1d9fc1f2d3e677ac6af92))
* App UI fullscreen behavior (android) ([27e2577](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/27e2577266577afce3080e18b8c2fdbf4b3429ed))
* **app:** add the h5p resize entry and update webpack ([ecfa53f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ecfa53f08061f47ae230ba2aedbeb8768774ea8b))
* **app:** auth and schedule compatibility with updated model ([caf27cc](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/caf27cc4c7b9ac67a2bac6e74fca4b4a955135ee))
* **app:** Can not join Live class after exit the Join page and join again. ([cbb385d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/cbb385d4238a60776288788d7184419f48efb980))
* **app:** Crashed when join Home Fun Study ([7938f6d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7938f6d405698e457d876052f32baeb8d7d17bf1))
* **app:** File name gets automatically renamed when to upload file ([5296a67](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5296a674444891fd85f0ecc06fa39269c7535298))
* **app:** fix cross-origin origin error and record script inject ([2efd4a8](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/2efd4a80a7983d9816a5f07058e3c5a2a9709706))
* **app:** fix issue with live room graphql connection ([b9db5b7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b9db5b7c64a5c1819d51d9ece1670c9471f07fd5))
* **app:** iOS download duplicate files and many text files ([58f9614](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/58f9614cecf3e4a4ebd9ae5d89ea53df5451300e))
* **app:** lock orientation to landscape on join page ([33355eb](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/33355eb97c0ceee1de5595d0532359599ada2401))
* **app:** Move rename function into HomeFunStudy, without rename in FileSelectService. ([d3f8ba9](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d3f8ba98de631061f5e1b4a82d808abab0f26d6d))
* **app:** Remove expand icon that views a full screen ([eab637d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/eab637d19ea42e38f8dd0baaa9d1bf7bc8ce49e6))
* **app:** replace absolute import paths with relative paths ([fe963c4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/fe963c4fbc30d97994e575ff0c75673ad8601d91))
* **app:** replace redux state with recoil state for hfs ([fc60fb0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/fc60fb06a4ed235403aa5b33484eb2d78a6f002b))
* **app:** replace redux state with recoil state for schedule ([fe51da1](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/fe51da1dbd7fd8855c24656d5986bc86f49f4405))
* **app:** replace redux state with recoil state for selectOrgDialog ([672fe5f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/672fe5f680cdb37cd0a10082e9c631955c3bbbd8))
* **app:** replace redux state with recoil state for selectUserDialog ([4bf2b84](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4bf2b844d073604b03d53c766df3287bbdef580d))
* **app:** replace redux with recoil for entry-cordova ([b031968](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b031968193a734ed5575544210bf99ba985ce515))
* **app:** select regionId based on cordova build variable ([7502f86](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7502f861c070f99485147fb197413220b70ad86f))
* **app:** Separately handle the download function for Android and iOS ([3de3513](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3de3513e628e53804c7599888bea401abf114e77))
* **app:** use absolute content url instead of relative ([bb82cde](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/bb82cdea7a5b762693c649e3e506bb7c298f8e20))
* **app:** use native camera permissions in cordova build ([11ffd7a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/11ffd7ac7383ad143b80c19233a8617397305e04))
* **app:** use recoil state for region-select-context ([00e2a79](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/00e2a791f280b5e7d69ca8a2a2feac1c76f97019))
* **app:** use recoil state in Header component ([3d28aaa](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3d28aaa632e044c7e720856bfdd09eff1dd9333b))
* **app:** use recoil state in user-information-context ([42ec39c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/42ec39caf6e68b2832d189bb7e2e06a593d94d20))
* **app:** use region select endpoint for class information ([5ae0a28](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5ae0a28e1fd8a03bd514b49a9684f52317b75c0b))
* **app:** user can not exit study class ([899f28b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/899f28b5cabec25e086fc32ba0d44291286c9a25))
* **app:** User cannot return to home page ([201b4f5](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/201b4f5cd56a5629a6d4e46d78b766106dddd699))
* Camera height size adjustment on mobile ([163792e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/163792ed4c868ec8c470a9e4f2016237b4bdde3c))
* **camera:** use correct constraints ([6615e67](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6615e67b0b1de795351e09cd07df9bddf1b58ccf))
* check if IFrame is YT video in every event ([d17f574](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d17f57450ed5d06290dfc2743c5efd1f2655b9bd))
* Clean web entry + separate browserGuide ([b861d65](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b861d65d6e353cb2c653935f74db328df783944c))
* custom Breakpoints to supports < 1024 devices adaptive layouts ([7f3203b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7f3203bb768a8b1cd56067cafbecc0012a6cabde))
* end/leave page not showing ([5e6a203](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5e6a2031663d216f01117ee69ecfde39d791e147))
* Fixed empty comment issue ([1e1efbd](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1e1efbdc1856a6c56123d33f2bb3bc8e769d1c33))
* Fixed infinity loading ([fa7c428](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/fa7c4288709ee3a2a4462097fb3df66a20934b0c))
* FullScreen turn off when going back to schedule ([eff144c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/eff144c6e15854ec263722e72c69f177fbaf3b66))
* **h5p:** inject h5p-resize script unless pdf ([b4295e2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b4295e2e6a562dc8ad7cee1f39496d2350edc923))
* **h5p:** remove complicated resizing code ([1af7302](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1af7302756b55d17d12fa985d47ab343da3eba64))
* hide version on join page (app only) ([de92f82](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/de92f822e23f265134041d8a3cfcb2ab7cb40ea3))
* imports ([47ab16e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/47ab16e04d653f1650db7e32cdfae1d8728e15db))
* **ios:** add message about unsupported platform ([354c068](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/354c068c1d04a70311274959b083d01db02d96d4))
* **ios:** pass webrtc device handler name if configured ([419b004](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/419b004d4a22c1dab7b59185d1ed7a61efe775fd))
* **ios:** reload webview when exiting to allow webrtc init to work ([2654442](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/26544424c1af1a34c8a199ec37465f99d7465a2d))
* **ios:** trigger permissions callback without iosrtc ([c758013](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c758013c437cadd0995849596909463beabd86ce))
* **ios:** use the webrtc implementation provided in iOS 14.3 ([3146146](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/31461464059d5cf7e64e5b4f8bbb8d0e8762c814))
* **join:** use camera-context to manage video/audio stream ([5fd5e59](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5fd5e599242123cbdefbaf0fa7ba7f2ea93e9845))
* **join:** use correct endpoint to fetch branding ([9b869e4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9b869e4066f44bac73622aa5972ed5a2c3c05183))
* Keep awake behavior on app using a new "layoutMode" state ([8afb69a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8afb69a88492da468682c57cc195bc78646276c9))
* Keep Awake feature ([c6c3444](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c6c3444a2694ba4eb1d8196a15044304ebcdca09))
* Keep support for both two preview pdf version ([26f10db](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/26f10dbe8e090c8f2b48e33b04c5a032db98b466))
* languageSelect import ([c3a2482](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c3a2482365c1fa7b6a43d97ce69bd20493c29ab5))
* Live class was exited automatically on iOS. ([e1862f7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e1862f72e394515cf42e38f1b8fc0eef229e4390))
* Live room safe padding (iOs) ([178c66d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/178c66d517bb4661a4c2dfc46e0180d4f0915298))
* live Room small UI on app (landscape optimisation) ([c904bd0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c904bd0eeacca3bc3a0ce4956a6879acd7ada7ff))
* **localization:** general localization fixes ([18b40a7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/18b40a75813e494da98eaa1ba49b42d38816114f))
* Moved saveDataBlobToFile and downloadDataBlob into Utils ([6b34728](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6b34728df67cdd621092bf2d67e08363278c3a42))
* re-enable fullViewHeightXs on mobile portrait ([0022db7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/0022db7a60b32c944990dfd690796c037f152ad1))
* Record script error on web local ([e59924c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e59924ca2104ac22820cf7f6c4c759383342121d))
* reformat code ([882e705](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/882e7051ce95fa66d2a6931b0e3e425603dccac3))
* remove authentication dependency from live-session-link ([19a2d23](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/19a2d2357276101e15c6ade2b5d1068c5d362485))
* remove authentication util dependency from recordediframe ([93ae1d3](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/93ae1d3788f27ccc84f55548839335fdce3f04c5))
* replace absolute import path with relative path ([f04f063](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f04f063697b218b3f9e5916e931075eb51f4c1ee))
* replace console.exception with console.error ([54922da](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/54922da51947233d5c61246cb789011bc71376aa))
* replace setImmediate with setTimeout(fn, 0) ([332a714](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/332a7145cd0f3d6d7bb6dbf34903a4d4f812bf07))
* **schedule:** fix issue with select user button ([1fae683](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1fae683c5a5daeb7118a4bfaeed99570f1eae297))
* **schedule:** fix schedule state field names ([c7888c1](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c7888c1190a476f9dfdb4b0f0c0a435c1a64ad06))
* search both TY related urls from stream event ([ba67e00](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ba67e001258f8a9eebc42e1704a53d813e459c26))
* session Context update on web ([7438d11](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7438d1123e9c75e7317a47c851f958d36e4be4e7))
* Shows correct schedule for today and tomorrow if class starts on an other day then today ([18badc6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/18badc63e191e229c33e4fc1cc4e507eb3c78667))
* Sort study schedule by date (start_at) ([63648cc](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/63648ccdc3334939f7b2e1fe37a9389f3609ccb9))
* Sorting Study : handle case where multiple study starts at the same time ([a0a04ec](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a0a04ecaafacc46582652c7947de2d6a79acba32))
* **translation:** add new camera unavailable on platform or version translation ([029e057](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/029e057431d829f9d8cf615cf70269b2b46cd07f))
* TS errors related to Material type ([69c9202](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/69c92021be27b3ff7497f41dd3bbf06fccf2e027))
* type error (this file might be deprecated though) ([f14b151](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f14b151f7998a2fd262a2d6a67bc970c8a69fbf6))
* Uncomment fetch regions for App region-select-context ([b710304](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b710304452038b50439b349d1cd5c492cfd6ccef))
* Update imports of Local providers ([9fa9b15](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9fa9b1512f54f4e6f61dec9ea3dc1dd47cbc9009))
* Update imports session-context ([5f27431](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5f27431f7c474f61825725d9213668f0b638403f))
* Update LessonMaterial type import ([f323764](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f32376488514e511ac9d829013a749918a29049d))
* Use "Room" instead of "Class".  + Rename App / layout files ([c1b1df6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c1b1df61b8989b0cf2820423ec7f4ec5ff6caf9c))
* use const variable rather than let ([16d5d7c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/16d5d7c856f2246386a37575157b50c943e36680))
* use cordova hook to modify info plist file ([c8fb689](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c8fb6890e0d3e2ecff06d7f1e5325172532115ae))
* Use correct useSessionContext file ([05694f2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/05694f26d22b2d8118ed6166514eea08463edf11))
* Use downloadDataBlob and saveDataBlobToFile functions in Utils ([9b186b9](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9b186b9788b55072aa1acaef3b36a373e85be175))
* Use live-session-link-context.tsx (Apollo provider for the Room) ([a27e310](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a27e310adde749ec96cf91ca8620b7f3c043b48a))
* Use session-context.tsx instead of LocalSessionContext ([3147aa6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3147aa69ab589b09114cd42487447ee46dad5825))
* Use the share function to save the attachment ([26b131c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/26b131c65413f1df379761ada9d3b500c1ddf5bd))
* Use updated RoomWithContext file for App room ([b14d9a0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b14d9a0c0c4511a700bc41df729ec49eedfcee76))
* User can't join another live class after leaving ([bf26c96](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/bf26c966bd17e9fd45bbf69dffad2d56ef1e04eb))
* Youtube video doesn't play and showing the popup about external page navigation while loading pdf content. ([d9723e0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d9723e078bb1917426d2428d0e450d04982b5959))

## [3.0.0-internal.3](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.0.0-internal.2%0Dv3.0.0-internal.3) (2021-10-15)


### Bug Fixes

* **app:** File name gets automatically renamed when to upload file ([51415c6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/51415c6b2309bcf8623c7abb5224a1cd845c8b70))
* **app:** Move rename function into HomeFunStudy, without rename in FileSelectService. ([270175e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/270175ebeb25e3c8aea843ddb6226f6810756d70))
* FullScreen turn off when going back to schedule ([c521114](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c521114720e2c5fd2275f7711e6c4d5e710aa865))
* use cordova hook to modify info plist file ([82303cf](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/82303cfa9e1bea255f96fe48e5d487e2397bb7a3))

## [3.0.0-internal.2](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v3.0.0-internal.1%0Dv3.0.0-internal.2) (2021-10-14)


### Features

* **app:** add student report KLL-1472 ([b1175b8](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b1175b8a4cce0ec7a909d63f3dbb1aa00a91a625))
* parentalGate : Auto open keyboard + auto validate if answer is good ([33aa855](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/33aa855d1d51040f37b0150437e532870997ed48))


### Bug Fixes

* add h5p resize entry to webpack config ([e056839](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e056839ab883fb90c9d6d85a98073618ee2ff2dd))
* App UI fullscreen behavior (android) ([f2e64a0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f2e64a0dd811e01b2845f2598ebacb0b7a4a8843))
* **app:** Can not join Live class after exit the Join page and join again. ([d2339be](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d2339be34ce6ec9ac779e18dd5fe46ba1540144b))
* **app:** user can not exit study class ([6d74ced](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6d74ced0b2ee4aac3d712124a06ffbcd84c6b04b))
* check if IFrame is YT video in every event ([119eb60](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/119eb607cbc218836f5784962b2ebe3e80baa57b))
* custom Breakpoints to supports < 1024 devices adaptive layouts ([76ac0bb](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/76ac0bbea7478854110be27fbe5557b01a4a255e))
* **h5p:** inject h5p-resize script unless pdf ([82ea508](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/82ea50881460560f414dedf300dc1dd9fece82e2))
* **h5p:** remove complicated resizing code ([ec8896c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ec8896c62482cea5dff0d35a5d41c01d45240965))
* **ios:** trigger permissions callback without iosrtc ([97cfbd9](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/97cfbd90cdedc47c77a07c132320f79233e8e0a3))
* Keep awake behavior on app using a new "layoutMode" state ([2d5c5df](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/2d5c5dfb72f9194aa65b96105ca155dea152b258))
* Keep Awake feature ([057eb39](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/057eb39c9edb54aa8c8b08d6e610f9766e11de66))
* Live room safe padding (iOs) ([947d58a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/947d58a3d2acde5facb3d4ebca19ea1bf52d7778))
* Record script error on web local ([620ae43](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/620ae436cffc3f93d460d87dc099257cebac9391))
* search both TY related urls from stream event ([9dc189e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9dc189e7334e0a6b4d48b7070e675b961b0bf672))
* Shows correct schedule for today and tomorrow if class starts on an other day then today ([337ba4e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/337ba4e5b3b9ed0ffe9fd2a3a2ff05094e550138))
* Sort study schedule by date (start_at) ([f3ab170](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f3ab170c3999da4efa873193c205f2e1834adc79))
* Sorting Study : handle case where multiple study starts at the same time ([fe3c3c2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/fe3c3c2306de7f4da446f1644d5ba59d50bcb052))
* use const variable rather than let ([801ce20](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/801ce20bc0a578972065c5959ef12c4a870058fb))

## [3.0.0-internal.1](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v2.0.15%0Dv3.0.0-internal.1) (2021-10-01)


### ⚠ BREAKING CHANGES

* **app:** replace redux state with recoil state for schedule
* **app:** replace redux with recoil for entry-cordova
* **app:** replace redux state with recoil state for hfs
* **app:** replace redux state with recoil state for selectUserDialog
* **app:** replace redux state with recoil state for selectOrgDialog
* **app:** use recoil state in user-information-context
* **app:** use recoil state for region-select-context
* **app:** use recoil state in Header component
* **app:** replace redux state with recoil state for schedule
* added app specific pages, dialogs, components, and utilities.

### Features

* add back button to join page on app ([8b047da](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8b047daec50eb37991cee3ed128ad4c53bc23d27))
* add exit button on app on endClass page (feedback page) ([ae16bf9](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ae16bf9069a7d4cb3b7521dbca30044d0b9a3688))
* Added preview the attachment when touch on the file icon ([847380f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/847380f1104fa5429f17d0eb716da73f94df378c))
* **app:** add loading component with retry button ([0754208](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/07542081731da150518277b4b76a1503c7335fa8))
* **app:** Get files in directory to generate an unique file name ([8725a1f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8725a1fc63b6988c9e86451461ab39617140d791))
* Enable hyperlink in description for schedule popup ([f4e5b8e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f4e5b8e961d69a9d61782809614dbc35cffafbce))
* iOS CORS workaround(native) ([bf5c3a4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/bf5c3a40669cfaf8146ff987fc60b7a57c2dfcc5))
* merge web with app localizations ([7a887bc](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7a887bcf7d5b7aa7af772e3d4716de78513388c5))
* Show error message if select camera was failed ([571e795](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/571e7955774d9295876f65dd71210b93b8800c89))


### Bug Fixes

* add Dotenv webpack plugin ([2ec0f62](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/2ec0f62c8c0acdbce49eb3809259b090f97b7be4))
* add missing env files ([a73d69c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a73d69c951b1ab43ffb8852a04df3fad15ff8015))
* add missing translations ([68771c2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/68771c2540d30b0751e693cbb522fa03aa66a2bf))
* add RecoilRoot for to entry-cordova ([458b5f7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/458b5f72efa8bdab2a7b80abcc28c7361c5c0a35))
* added app specific pages, dialogs, components, and utilities. ([066d0ab](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/066d0abfb1f57f89309bcaa9e25614ff721696e1))
* **app:** add the h5p resize entry and update webpack ([8d33fbb](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8d33fbb3655d475d81d445fb0042b0ca753db037))
* **app:** auth and schedule compatibility with updated model ([817d8f5](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/817d8f5859a15b277390226fe36a72622418d5c5))
* **app:** fix cross-origin origin error and record script inject ([9703d3c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9703d3c46006f6ebf97e51f260462011b166db8e))
* **app:** fix issue with live room graphql connection ([6da2ffe](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6da2ffebfe54200c891c5d3e16959642f8ac9063))
* **app:** iOS download duplicate files and many text files ([c3563c4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c3563c4e0abd3beb5f9bf76aad9a83fc872bc1f6))
* **app:** lock orientation to landscape on join page ([4a203c6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4a203c6f567f7b5f24ec5ed327b5096200b3bfe6))
* **app:** replace absolute import paths with relative paths ([d71a5b6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d71a5b6eafd338f6f06169053687e231a99947c7))
* **app:** replace redux state with recoil state for hfs ([b478686](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b478686fb9fa4caaa8fb6ea112533c97097799ec))
* **app:** replace redux state with recoil state for schedule ([eff76b8](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/eff76b87e17adca9bd46f50545410606a86236c6))
* **app:** replace redux state with recoil state for schedule ([53645a1](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/53645a1a3dd9c5543a7034f3d7dac1f7f38858f5))
* **app:** replace redux state with recoil state for selectOrgDialog ([7c72665](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7c726651b36a2729e48ac85d43997db53daf2771))
* **app:** replace redux state with recoil state for selectUserDialog ([db37872](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/db37872b3de0ed9f5f965e219c1f50fe4ca23483))
* **app:** replace redux with recoil for entry-cordova ([23fac01](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/23fac0111602322830bb8056c710cf3856cda8b9))
* **app:** select regionId based on cordova build variable ([01ec01b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/01ec01b010c14ddcf708dd05ed0ba371c229ec77))
* **app:** Separately handle the download function for Android and iOS ([72b1ab0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/72b1ab00b002b7a94949cbf53f8bb04f38f1ec8c))
* **app:** use absolute content url instead of relative ([8ef5226](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8ef5226622af91b5d33b841775d33ae824f11a40))
* **app:** use native camera permissions in cordova build ([5415957](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/54159572928c94c84fc01e27132eebaf7500413d))
* **app:** use recoil state for region-select-context ([22c8cfa](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/22c8cfaf96c8643c7c85bd37688ba72ee426d468))
* **app:** use recoil state in Header component ([498e0ae](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/498e0aec627494ef426b241bc254a72e8a6417ed))
* **app:** use recoil state in user-information-context ([44c3f99](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/44c3f99dcb2e6996479540cd54e5f6ff3ab105a6))
* **app:** use region select endpoint for class information ([974ceb9](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/974ceb94f834eabbcdb68807a8d727ba6f2de024))
* **app:** User cannot return to home page ([1e08f58](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1e08f5844f0e07dca759f4bffcfd2c43301a89df))
* build pipeline ([795022d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/795022d4367f6f9b9e70ef86b0007862856cd18f))
* Camera height size adjustment on mobile ([ba16784](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ba167847006f3ece31e472285e6c142bd31a3370))
* **camera:** use correct constraints ([840b524](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/840b5242ec59ceea4c52eeb5299bb19dcd40c1c4))
* Clean web entry + separate browserGuide ([f740df3](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f740df3cf426103a10477da5a63d68c5e59b9162))
* clear git cache ([00c6b81](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/00c6b819446bc2bc1099b21a62baceb93bd38e05))
* end/leave page not showing ([1fb8757](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1fb87576830131f0ddd1dbbfb97453e92b78ea9d))
* Fixed empty comment issue ([baefcac](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/baefcacd04898eeb03c53c7d3c96741cae5946a9))
* Fixed infinity loading ([e662805](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e662805586a3e478e7cb350b46d0f181dc06b83a))
* hide version on join page (app only) ([823ceca](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/823cecabe3145a8977b826813f601a056473adf8))
* imports ([44549fd](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/44549fdaf1bad3daf5ccd6221e73f6564890df22))
* **ios:** add message about unsupported platform ([3c060ae](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3c060ae44e78b54b6e08d30fd77471899c62f9c0))
* **ios:** pass webrtc device handler name if configured ([8054d60](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8054d6034ca8397a6fee266b1a4ec7f8fa8d5a2c))
* **ios:** reload webview when exiting to allow webrtc init to work ([6727164](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6727164ec94b7886baf4b30051333b8d8c43b212))
* **ios:** use the webrtc implementation provided in iOS 14.3 ([7d3cd59](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7d3cd5912be464ccda999a7a1827058500e18314))
* **join:** use camera-context to manage video/audio stream ([6c06520](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6c0652064d93d42c8e639d853921b1ed42c0bf51))
* **join:** use correct endpoint to fetch branding ([88bd1cd](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/88bd1cd1d92510d5ee13dc54b691ae2928e83bfc))
* Keep support for both two preview pdf version ([cb85c93](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/cb85c93bb92cc348c2be52b4723c0d12233faa7d))
* languageSelect import ([795d075](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/795d0752f8164fdb15bd6c51643188bbf23b6865))
* Live class was exited automatically on iOS. ([ee14f45](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ee14f4514f7c6573e34ba01f0c891d6b3bd0e057))
* live Room small UI on app (landscape optimisation) ([8134df6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8134df69825a2698b2edceb69f27df2542123a7f))
* **localization:** general localization fixes ([a46ed6e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a46ed6e402e120e83e6f03963ec46388f4408dee))
* Moved saveDataBlobToFile and downloadDataBlob into Utils ([ddbe945](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ddbe945c0c69fb195a1e71d0693cce88371e259c))
* re-enable fullViewHeightXs on mobile portrait ([682b767](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/682b767d9b8f78f0088aae6a0b629663e460217a))
* reformat code ([1bc02e2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1bc02e22659d1c8767161b6eb312ba08b87b0289))
* remove authentication dependency from live-session-link ([ab70631](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ab706316fb6c557f256a89d89f5b997306596b6c))
* remove authentication util dependency from recordediframe ([c4311da](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c4311da77aa2e70363aae3c108f60a43b392f7e0))
* remove sentry ([24e3bda](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/24e3bda48ea541c8a377194baab8b97e18bcdc33))
* replace absolute import path with relative path ([d7f87ee](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d7f87eead3bef1f9f6b2737b3edbe53d0f1b1c28))
* replace console.exception with console.error ([1f9f6b5](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1f9f6b5d0c3947bc18c5125ed97d21a46df4926d))
* replace setImmediate with setTimeout(fn, 0) ([8a589ba](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8a589ba73d13a2b1b2d9671ebd2f498442b8bd58))
* **schedule:** fix issue with select user button ([681745d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/681745d0aae9862c4cec2050d8afbcab8d1deb08))
* **schedule:** fix schedule state field names ([c1462a1](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c1462a1a6d331605187ea60a16e12d3da99c1666))
* **translation:** add new camera unavailable on platform or version translation ([f8b8ef3](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f8b8ef3584c9db3a4ca31f4413edd58e9bdddc99))
* TS errors related to Material type ([4b7765e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4b7765e6cc3ea090cea2e44961892ab441eeb04e))
* type error (this file might be deprecated though) ([078c9f8](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/078c9f83ca5ee214692722bc0f452357efbb0bac))
* Uncomment fetch regions for App region-select-context ([d02bc44](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d02bc44c753ccc37d70c599528fda87193beef43))
* Update imports of Local providers ([17b2ec7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/17b2ec79d29882c2192d13e634398409658654bf))
* Update imports session-context ([c7c8a64](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c7c8a643364f2187ddb4d9395204e3db2bd3ed73))
* Update LessonMaterial type import ([0916fef](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/0916fef2ec9ddf6c1238cc860d4c126622da99bf))
* Use "Room" instead of "Class".  + Rename App / layout files ([e4c0acf](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e4c0acf5450317c213b32d5cead9fbc218811932))
* Use correct useSessionContext file ([3a318a1](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3a318a17b9e04ea758596734b3a03ed8aabb6115))
* Use downloadDataBlob and saveDataBlobToFile functions in Utils ([9f3348c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9f3348c9c5c3ec65112ae7a8223514ec173ad021))
* Use live-session-link-context.tsx (Apollo provider for the Room) ([c014199](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c01419966d509bdf6ccfd2cbed070aa896596ec4))
* Use session-context.tsx instead of LocalSessionContext ([29763da](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/29763da73138068e29d2f0d98b1144bd947f2cfb))
* Use the share function to save the attachment ([5cffbc4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5cffbc4900cfca94652ad6620c3dc6869d367f35))
* Use updated RoomWithContext file for App room ([215ba15](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/215ba153ce8283be7636a24dc342718af0840500))
* User can't join another live class after leaving ([31695b2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/31695b24e50b4a482e19c820ecb02aabd91f21ca))
* Youtube video doesn't play and showing the popup about external page navigation while loading pdf content. ([8e0d46f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8e0d46f168762c94c61ddedb3fb7d97f3525fe03))

## [3.0.0-internal.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v2.0.15%0Dv3.0.0-internal.0) (2021-09-24)


### ⚠ BREAKING CHANGES

* **app:** replace redux state with recoil state for schedule
* **app:** replace redux with recoil for entry-cordova
* **app:** replace redux state with recoil state for hfs
* **app:** replace redux state with recoil state for selectUserDialog
* **app:** replace redux state with recoil state for selectOrgDialog
* **app:** use recoil state in user-information-context
* **app:** use recoil state for region-select-context
* **app:** use recoil state in Header component
* **app:** replace redux state with recoil state for schedule
* added app specific pages, dialogs, components, and utilities.

### Features

* add back button to join page on app ([8b047da](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8b047daec50eb37991cee3ed128ad4c53bc23d27))
* add exit button on app on endClass page (feedback page) ([ae16bf9](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ae16bf9069a7d4cb3b7521dbca30044d0b9a3688))
* Added preview the attachment when touch on the file icon ([847380f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/847380f1104fa5429f17d0eb716da73f94df378c))
* **app:** add loading component with retry button ([0754208](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/07542081731da150518277b4b76a1503c7335fa8))
* Enable hyperlink in description for schedule popup ([f4e5b8e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f4e5b8e961d69a9d61782809614dbc35cffafbce))
* iOS CORS workaround(native) ([bf5c3a4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/bf5c3a40669cfaf8146ff987fc60b7a57c2dfcc5))
* merge web with app localizations ([7a887bc](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7a887bcf7d5b7aa7af772e3d4716de78513388c5))


### Bug Fixes

* add Dotenv webpack plugin ([2ec0f62](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/2ec0f62c8c0acdbce49eb3809259b090f97b7be4))
* add missing env files ([a73d69c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a73d69c951b1ab43ffb8852a04df3fad15ff8015))
* add missing translations ([68771c2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/68771c2540d30b0751e693cbb522fa03aa66a2bf))
* add RecoilRoot for to entry-cordova ([458b5f7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/458b5f72efa8bdab2a7b80abcc28c7361c5c0a35))
* added app specific pages, dialogs, components, and utilities. ([066d0ab](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/066d0abfb1f57f89309bcaa9e25614ff721696e1))
* **app:** add the h5p resize entry and update webpack ([8d33fbb](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8d33fbb3655d475d81d445fb0042b0ca753db037))
* **app:** auth and schedule compatibility with updated model ([817d8f5](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/817d8f5859a15b277390226fe36a72622418d5c5))
* **app:** fix cross-origin origin error and record script inject ([9703d3c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9703d3c46006f6ebf97e51f260462011b166db8e))
* **app:** fix issue with live room graphql connection ([6da2ffe](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6da2ffebfe54200c891c5d3e16959642f8ac9063))
* **app:** lock orientation to landscape on join page ([4a203c6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4a203c6f567f7b5f24ec5ed327b5096200b3bfe6))
* **app:** replace absolute import paths with relative paths ([d71a5b6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d71a5b6eafd338f6f06169053687e231a99947c7))
* **app:** replace redux state with recoil state for hfs ([b478686](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b478686fb9fa4caaa8fb6ea112533c97097799ec))
* **app:** replace redux state with recoil state for schedule ([eff76b8](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/eff76b87e17adca9bd46f50545410606a86236c6))
* **app:** replace redux state with recoil state for schedule ([53645a1](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/53645a1a3dd9c5543a7034f3d7dac1f7f38858f5))
* **app:** replace redux state with recoil state for selectOrgDialog ([7c72665](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7c726651b36a2729e48ac85d43997db53daf2771))
* **app:** replace redux state with recoil state for selectUserDialog ([db37872](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/db37872b3de0ed9f5f965e219c1f50fe4ca23483))
* **app:** replace redux with recoil for entry-cordova ([23fac01](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/23fac0111602322830bb8056c710cf3856cda8b9))
* **app:** select regionId based on cordova build variable ([01ec01b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/01ec01b010c14ddcf708dd05ed0ba371c229ec77))
* **app:** use absolute content url instead of relative ([8ef5226](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8ef5226622af91b5d33b841775d33ae824f11a40))
* **app:** use native camera permissions in cordova build ([5415957](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/54159572928c94c84fc01e27132eebaf7500413d))
* **app:** use recoil state for region-select-context ([22c8cfa](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/22c8cfaf96c8643c7c85bd37688ba72ee426d468))
* **app:** use recoil state in Header component ([498e0ae](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/498e0aec627494ef426b241bc254a72e8a6417ed))
* **app:** use recoil state in user-information-context ([44c3f99](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/44c3f99dcb2e6996479540cd54e5f6ff3ab105a6))
* **app:** User cannot return to home page ([1e08f58](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1e08f5844f0e07dca759f4bffcfd2c43301a89df))
* build pipeline ([795022d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/795022d4367f6f9b9e70ef86b0007862856cd18f))
* Camera height size adjustment on mobile ([ba16784](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ba167847006f3ece31e472285e6c142bd31a3370))
* Clean web entry + separate browserGuide ([f740df3](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f740df3cf426103a10477da5a63d68c5e59b9162))
* clear git cache ([00c6b81](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/00c6b819446bc2bc1099b21a62baceb93bd38e05))
* end/leave page not showing ([1fb8757](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1fb87576830131f0ddd1dbbfb97453e92b78ea9d))
* Fixed empty comment issue ([baefcac](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/baefcacd04898eeb03c53c7d3c96741cae5946a9))
* Fixed infinity loading ([e662805](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e662805586a3e478e7cb350b46d0f181dc06b83a))
* hide version on join page (app only) ([823ceca](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/823cecabe3145a8977b826813f601a056473adf8))
* imports ([44549fd](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/44549fdaf1bad3daf5ccd6221e73f6564890df22))
* **join:** use camera-context to manage video/audio stream ([6c06520](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6c0652064d93d42c8e639d853921b1ed42c0bf51))
* Keep support for both two preview pdf version ([cb85c93](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/cb85c93bb92cc348c2be52b4723c0d12233faa7d))
* languageSelect import ([795d075](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/795d0752f8164fdb15bd6c51643188bbf23b6865))
* Live class was exited automatically on iOS. ([ee14f45](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ee14f4514f7c6573e34ba01f0c891d6b3bd0e057))
* live Room small UI on app (landscape optimisation) ([8134df6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8134df69825a2698b2edceb69f27df2542123a7f))
* **localization:** general localization fixes ([a46ed6e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a46ed6e402e120e83e6f03963ec46388f4408dee))
* Moved saveDataBlobToFile and downloadDataBlob into Utils ([ddbe945](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ddbe945c0c69fb195a1e71d0693cce88371e259c))
* re-enable fullViewHeightXs on mobile portrait ([682b767](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/682b767d9b8f78f0088aae6a0b629663e460217a))
* reformat code ([1bc02e2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1bc02e22659d1c8767161b6eb312ba08b87b0289))
* remove authentication dependency from live-session-link ([ab70631](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ab706316fb6c557f256a89d89f5b997306596b6c))
* remove authentication util dependency from recordediframe ([c4311da](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c4311da77aa2e70363aae3c108f60a43b392f7e0))
* remove sentry ([24e3bda](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/24e3bda48ea541c8a377194baab8b97e18bcdc33))
* replace absolute import path with relative path ([d7f87ee](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d7f87eead3bef1f9f6b2737b3edbe53d0f1b1c28))
* replace console.exception with console.error ([1f9f6b5](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/1f9f6b5d0c3947bc18c5125ed97d21a46df4926d))
* replace setImmediate with setTimeout(fn, 0) ([8a589ba](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8a589ba73d13a2b1b2d9671ebd2f498442b8bd58))
* **schedule:** fix issue with select user button ([681745d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/681745d0aae9862c4cec2050d8afbcab8d1deb08))
* **schedule:** fix schedule state field names ([c1462a1](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c1462a1a6d331605187ea60a16e12d3da99c1666))
* TS errors related to Material type ([4b7765e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4b7765e6cc3ea090cea2e44961892ab441eeb04e))
* type error (this file might be deprecated though) ([078c9f8](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/078c9f83ca5ee214692722bc0f452357efbb0bac))
* Uncomment fetch regions for App region-select-context ([d02bc44](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/d02bc44c753ccc37d70c599528fda87193beef43))
* Update imports of Local providers ([17b2ec7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/17b2ec79d29882c2192d13e634398409658654bf))
* Update imports session-context ([c7c8a64](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c7c8a643364f2187ddb4d9395204e3db2bd3ed73))
* Update LessonMaterial type import ([0916fef](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/0916fef2ec9ddf6c1238cc860d4c126622da99bf))
* Use "Room" instead of "Class".  + Rename App / layout files ([e4c0acf](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e4c0acf5450317c213b32d5cead9fbc218811932))
* Use correct useSessionContext file ([3a318a1](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3a318a17b9e04ea758596734b3a03ed8aabb6115))
* Use downloadDataBlob and saveDataBlobToFile functions in Utils ([9f3348c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9f3348c9c5c3ec65112ae7a8223514ec173ad021))
* Use live-session-link-context.tsx (Apollo provider for the Room) ([c014199](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c01419966d509bdf6ccfd2cbed070aa896596ec4))
* Use session-context.tsx instead of LocalSessionContext ([29763da](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/29763da73138068e29d2f0d98b1144bd947f2cfb))
* Use the share function to save the attachment ([5cffbc4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5cffbc4900cfca94652ad6620c3dc6869d367f35))
* Use updated RoomWithContext file for App room ([215ba15](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/215ba153ce8283be7636a24dc342718af0840500))
* User can't join another live class after leaving ([31695b2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/31695b24e50b4a482e19c820ecb02aabd91f21ca))
* Youtube video doesn't play and showing the popup about external page navigation while loading pdf content. ([8e0d46f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8e0d46f168762c94c61ddedb3fb7d97f3525fe03))

## [1.18.0-alpha.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v1.17.0%0Dv1.18.0-alpha.0) (2021-08-26)


### Features

* add download attachment functionality ([ef90c27](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ef90c272143d24d3e574981edb388b5883e89291))


### Bug Fixes

* add key for AnytimeStudyItem ([a35f13d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/a35f13d0d1d8aa346b29ce4f55c17744387b6de7))
* Added condition for Go Live button ([c8b0cd3](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c8b0cd323a45928973cce3ab36d5b84fc4e6490d))
* Break all the text to make sure every text haven't overlapped anymore ([6503126](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/6503126fc384c07834464707ebcee1cc5ef90235))
* improve study detail UI ([3c6f721](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/3c6f721fcaf5229190dc86e359aab62c4104607d))
* Missing exclamation mark ([4d47170](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4d47170893bc6ba011b2974434a859ddb3d05e68))
* Re-handle joinButton to show the error messages. ([c221272](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/c2212728861e52c98da8e3657867db51a76fb7e7))
* refactor getLocalFeedback function to improve performance and hide the error log ([4e8630e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4e8630e3f25ee79f05da44a0718be5031a53bfd8))

## [1.17.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v1.17.0-alpha.0%0Dv1.17.0) (2021-08-20)


### Features

* Added CustomCircularProgress ([9b7fa8d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9b7fa8d7fc075951f9669d6f2784988b361d4faa))
* Display Schedule popup for Live ([8fbcd8d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8fbcd8de400b776895e53383d43b5ac0c2c841ec))
* Display the upload progress ([b65c993](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b65c993410d4525281bb57e6d0b258448d8f7c7c))


### Bug Fixes

* 2nd file gets wiped out if user upload 2nd file while previous file upload is in progress ([5743af3](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5743af3b493115bb2a9bf41c164de77d8ef06374))
* Add submitStatus dependency ([b12b6f4](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b12b6f4b042f3dbeff431203c1cc2dc475068535))
* Added default messages ([fcfd0b7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/fcfd0b7c1b168c02163e9800db815edf6a2e5344))
* Apply paddingRight for all ScheduleItem's Lesson Name ([198849b](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/198849b7121c130df25c8037dd834f1bfe3f7ccf))
* Force all Dialogs fit inside safe area ([8f942f0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/8f942f04d4657a616bf5829d81da64f3410d1f86))
* Improve button status for ios, force to re-render after disable status was changed ([4ea03bc](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/4ea03bcb777e2bcaaa598c831a022ac7460ba863))
* Improve the submit button display function ([50ebedb](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/50ebedb286610d42ab3cddf7523dba664b672bb3))
* Improve the UI for Android and iOS ([889cc51](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/889cc515bbf12c31f6ccb2c5cc04faaf97bd9eb9))
* Increase timeout to solve disabled button problem ([31292ab](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/31292ab2b1f053204da428065a581a0ee2e5fd29))
* **ios:** fix issue uploading wav files on iOS ([92f3f30](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/92f3f306885783a9674121d6d88ac4f8926db815))
* **ios:** prevent users leaving app when clicking youtube links ([061f672](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/061f672d28a7451149f66e9bc4be3bedbe5d836a))
* Only respond true if the status is 200 ([13a3c38](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/13a3c3854796ad89478d71a1f8f65c0dd9e00c7d))
* Solve the black background problem at the Live class ([9a84935](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9a84935c93aa9dca938160cc14f139a3c8b92847))
* Use both overflow-wrap and word-wrap to support for more devices ([f006f1f](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/f006f1f39517abd7db7b1d93a3dfd54852989231))

## [1.16.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/compare/v1.15.0...v1.16.0) (2021-08-12)


### Features

* Multiple Profile Support for Home Fun Study ([4c00eb8](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/4c00eb8dcef763c7dc19e247cae94b204332789f))


### Bug Fixes

* disallow uploading multiple files at once ([e28f7b9](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/e28f7b98329f62a0600a756829ed68ed3d4e7ee4))
* force a line break in a long file name ([f1205ed](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/f1205ed10fd69399ee9302751a654ba2cd7d7ed4))
* Removed test script ([2f5cf88](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/2f5cf8878d0c9a456e0e78dea9bd80b288a417fd))
* Schedule information appears as overlapped with Submitted string ([f3ed5b7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/f3ed5b7db02ab868b0b8e0debee3fa0578f49f61))

## 1.15.0 (2021-08-12)


### Features

* add optional custom message for parental lock ([a46d4fb](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/a46d4fbbc436b5a230e545c76a1549c3690a701d))
* add plugin for intercepting external navigation ([c377bd8](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/c377bd855f8f4d39c710f7bca057d8824d04f3a1))
* add popup confirming download if using cellular connection ([c0b9a04](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/c0b9a046c2af0a6598b1948c6a8ca58c693b251d))
* add popup confirming upload if using cellular connection ([99a812a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/99a812a24eb2081a5fa815d685754c7fca73630d))
* Add PopUp Message When User Tries to Add a File ([54f60c6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/54f60c601292e7e2229d96a164fb5cb5bb14a7b3))
* Added AssessmentService ([91c8ef2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/91c8ef28c39417f9d53e348798a2058a4ab011ef))
* Added new mime-type for bmp ([ac1c606](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/ac1c60602d66e2132943a06c5ac218788b8bde69))
* Display Error Popup When User Submits Before File Uploading is Finished ([c1627db](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/c1627db02814cbad8acccc7706a50545b24d7569))
* Download attachment into tempDirectory at iOS ([6113938](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/6113938201114a394178970b43462bf98ec68a9b))
* Download the attachment into externalCacheDirectory and preview it by native apps ([2a844bb](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/2a844bb40b19eff71712962b163e83cc52fa5799))
* generate attachment file names and extension if missing ([478468d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/478468d7557daeef3b33072403946d083dbfc398))
* Generate the key for the dialog to rerender it ([9f6dd6a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/9f6dd6ab0e8cb9782a2f6a3b7f8a555bfdd8908e))
* Load AssessmentService into ServiceProvider ([45d65b7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/45d65b7d050c7d1b21a6f7c96cbae89756aa12c4))
* prevent external navigation with prompt and parental lock ([a1baca3](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/a1baca37dd97dda4d067bcf2c57826c19a1dd0bf))
* Request READ_EXTERNAL_STORAGE permission before select file ([9271405](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/9271405192782026cdd05add293f10f0ba2fb7df))
* Sync assignment items from cms and local ([bb68127](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/bb681276cadb1ccb6ef748ce3ec66ab7a83eeb11))


### Bug Fixes

* add additional mime types for avi and bmp extensions ([911b532](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/911b5321fa8c21ba3562f762d116edc4b27b38df))
* always display the cellular upload/download warning ([ccf663c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/ccf663cc5eb7de0db24075752fd3720103c25fe2))
* Check the HFS status by is_allow_submit ([ce1fc95](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/ce1fc95615c089067a78be70c9d1a62f1b939a80))
* Check the permission before request it ([eb1debb](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/eb1debb14d556eed0f09304906f717b8d27a979c))
* Clarify info popup display conditions ([5f8c1ea](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/5f8c1eac1ccfb44ff08b209db003358d5460db16))
* disable code causing FILE_NOT_FOUND error ([ee7b33c](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/ee7b33c7297bc4d590bc9a28e51bbe24f5614960))
* Don't use the permissions state from the context ([8dc73f8](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/8dc73f881f2a27902f377b33029f5e20e4679098))
* Each child in a list should have a unique "key" prop. ([969a283](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/969a283260d88d98c7537ba37178b606f332d36a))
* Every file uploaded by HFS appears as content without any extension ([8cdc96d](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/8cdc96d9928a98bebccaa0d80ff478d1c37e66b5))
* Fix crash if the assignment was null ([d02384e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/d02384e9c5c226bbf9e5e9200ddfcc95de00c160))
* Fix the label for Close Button to 'Close' ([ce314dc](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/ce314dcf5810f3a8d2fd57ce9097cf0e070ddea6))
* Fix typo from 'date' to 'data' ([dfdb677](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/dfdb677744eace2c81ef606bfc7acc7a339809e8))
* Get extension from file name would be better, some file types are not mentioned in MIME_TYPE ([1c8a1c6](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/1c8a1c66a847403764a38c24801085391dfa4305))
* Improve to not print some error logs ([d0b38ba](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/d0b38baca42cb97e01624a31b83fd7e020d86245))
* Move requestPermission function into cordova-system-context, check platform inside the requestPermission function ([bef0750](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/bef0750f4c7f3405fed03fab576fb2fed064b7d8))
* PermissionType.CAMERA should only be included if getCameraDevice is true ([07d2d47](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/07d2d470b4bdc3a484b064772e14ef9e616b13d8))
* Re-declare FileProvider to use v4 library instead of androidx which previewAnyFile plugin is using ([d406cdd](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/d406cdde88d7ea326c2183a565daad2212018161))
* Re-handle the study list, use AssessmentForStudent API to show the HFS status is Submitted or Assessment Complete ([a9b2447](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/a9b24472c038d03273b7afee841b2783989e2fa6))
* Re-handle upload file function, catch all errors. ([5b86eb0](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/5b86eb01d4405e4417097f875ccc975a2305c3f6))
* replace file-transfer plugin with XMLHTTPRequest ([b1d1382](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/b1d13822aba70c35cebd1f0ee12002b3f81b5d31))
* Revert to getFileExtensionFromType, because some files are no extension in file name ([be83b59](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/be83b59ed9408908cd732d7279d044664bea3b2a))
* Show the block popup if is_allow_submit is false ([ea59451](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/ea59451c8ec383f12ded1d2e09156e60fb842bc4))
* The save button on the iOS platform doesn't auto re-render ([ddbafc2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/ddbafc25a14ddc194a006dacc814ff2b0b6c6b51))
* Use newest_feedback API instead of schedule_feedbacks API to get the latest feedback ([1aff45e](https://bitbucket.org/calmisland/kidsloop-live-frontend/commit/1aff45ef3f8e59299c15d26751555d6e5789912a))
