# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
