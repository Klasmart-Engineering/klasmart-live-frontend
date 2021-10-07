# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.19.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v1.18.0%0Dv1.19.0) (2021-10-07)


### Features

* Send event for an open ‘Study’ class type ([b508fb7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/b508fb77848cc958dec74ae5a2127686d0728f1a))


### Bug Fixes

* Study class shouldn't record events if it's in Black (OnStage) interactive mode. ([254f951](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/254f951b1193a5098aa51ed5e6188ae6ef402612))

## [1.18.0](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v1.18.0-alpha.2%0Dv1.18.0) (2021-09-23)


### Bug Fixes

* add region definition for Pakistan ([9bd63a7](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/9bd63a7e763eb49218581b51a84e446992bbcd4c))

## [1.18.0-alpha.2](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v1.18.0-alpha.1%0Dv1.18.0-alpha.2) (2021-09-16)


### Features

* Enable hyperlink in description for Schedule Popup ([65340d2](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/65340d24ff66d90bc6bcb6dfeecede70110badb5))
* Preview the attachment when user click the file icon ([40e030a](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/40e030afd11070ca537267f32b8ff4d512b8f2a3))
* Use share functionality to save the attachment ([7e20860](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/7e20860d85f883e6e90e8ae8f0203ed32a5c424d))


### Bug Fixes

* [KLL-1263] Disable JoinButton if the schedule is expired ([ab6ad11](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/ab6ad11ae7a0e4e5bb6b3516e8cfd85401921f14))
* Moved downloadDataBlob and saveDataBlobToFile to Utils ([5644378](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/5644378d23a5b9e2a87745a03e1adfe4ca79b496))

## [1.18.0-alpha.1](https://bitbucket.org/calmisland/kidsloop-live-frontend/branches/compare/v1.18.0-alpha.0%0Dv1.18.0-alpha.1) (2021-08-30)


### Features

* Add a popup to ask for a permission to access to the files ([e4441bd](https://bitbucket.org/calmisland/kidsloop-live-frontend/commits/e4441bd67ef62241856025e23ea80327af126f3c))

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
