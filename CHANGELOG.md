# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
