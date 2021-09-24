# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
