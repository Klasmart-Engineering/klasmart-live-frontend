# Local Setup

## Install Husky commit hooks
This project is using [Husky](https://typicode.github.io/husky/#/) to lint commit messages. Run the following command to set up these hooks before making any commits to the project. The linting is configured to follow [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
```
npm run prepare
```
## Prerequisites

-   Docker installed and running. [Download here](https://www.docker.com/products/docker-desktop).
-   Locally cloned versions of the folowing repositories:
    -   [kidsloop-live-server](https://bitbucket.org/calmisland/kidsloop-live-server)
    -   [kidsloop-sfu](https://bitbucket.org/calmisland/kidsloop-sfu)
    -   [kidsloop-sfu-gateway](https://bitbucket.org/calmisland/kidsloop-sfu-gateway)

### Mac

Add the following to your `~/.bash_profile` file (or create the file if it doesn't exist)

```bash
export DEV_SECRET='iXtZx1D5AqEB0B9pfn+hRQ=='
```

_If you use a different terminal other than **Bash**, you might need to load the Bash config file into your terminal's config._

### Zsh

Add the following to `~/.zshenv` (or create the file if it doesn't exist)

```zsh
source ~/.bash_profile
```

## 1. `kidsloop-live-server`

Open up a terminal, and navigate to your local root of `kidsloop-live-server` and enter the following commands:

```sh
docker run --name some-redis -p 6379:6379 -d redis
docker run --name postgres -e POSTGRES_PASSWORD=PASSWORD -p 5432:5432 -d postgres
npm install
npm run dev
```

## 2. `kidsloop-sfu-gateway`

Open up a terminal, and navigate to your local root of `kidsloop-sfu-gateway` and enter the following commands:

```sh
npm install
npm run dev
```

## 3. `kidsloop-sfu`

Open up a terminal, and navigate to your local root of `kidsloop-sfu` and enter the following commands:

```sh
npm install
USE_IP=1 npm run dev
```

## 4. `kidsloop-live-frontend`

1. Add the following redirect config to your computer's `hosts` file

```host
local.alpha.kidsloop.net    localhost
```

2. Navigate to your local root of `kidsloop-live-frontend` and copy the contents of `env.example` (or fill out with the wanted values) and create a new file called `.env` and place it in the same folder:
3. Enter the following commands in the terminal:

```sh
npm start
```

### Connect to a Local Live Class **with a valid Access Cookie**

#### Generate a **Teacher** token

1. Go to https://hub.alpha.kidsloop.net
2. Sign in with an account that has a Teacher user
3. Navigate to `/schedule`
4. In the left toolbar, under Class Types, check the checkbox for "Live"
5. Click on an ongoing class in the calendar
6. Press the "Go Live"-button in the dialog that pops up
7. Copy the `TOKEN` from the address bar (`.../?token=TOKEN`)
8. Navigate to jwt.io
9. Change the "Algorithm" to "HS256"
10. Paste the `TOKEN` in the "Encoded" section
11. In the "HEADER" section, add `"issuer": "calmid-debug"`
12. In the "VERIFY SIGNATURE" section, insert the `DEV_SECRET` as the `your-256-bit-secret`
13. In the "PAYLOAD" section, change the `"iss"` value to `"calmid-debug"`
14. Copy the newly generated `TOKEN` from the "Encoded" section
15. Open up a new tab and browse to https://local.alpha.kidsloop.net:8082/?token=TOKEN

#### Generate a **Student** token

1. Follow the all same steps in "Generate a **Teacher** token" until and including **Step 13**
2. In the "PAYLOAD" section, change the `"teacher"` value to `false`
3. Copy the newly generated `TOKEN` from the "Encoded" section
4. Open up a new tab and browse to https://local.alpha.kidsloop.net:8082/?token=TOKEN

### Connect to a Local Live Class **and bypass the valid Access Cookie check**

1. In `kidsloop-live-server/src/main.ts` comment out the usage of:
    - `checkToken` (lines ~ 58-64)
    - `checkToken` (lines ~ 138-144)
2. Restart `kidsloop-live-server`
3. In `kidsloop-live-frontend/webpack.config.js` change `module.exports.devServer.https` to `false`
4. Restart `kidsloop-live-frontend`

_NOTE: When joining a class without a valid Access Cookie, you need to use the browser Safari. After you have successfully joined you can copy the web address in Safari and paste it into Chrome or any other browser._

# FAQ

## Build Issues

**I have trouble building `kidsloop-live-frontend` due to issues cloning `kidsloop-canvas`**

Try adjusting your `.gitconfig` to have the following information:

```
[url "ssh://git@bitbucket.org"]
	insteadOf = https://bitbucket.org
```

This should prevent npm from trying to use https when pulling down repos from bitbucket.

## Live Class Issues

**I have old Users (aka Ghost Users) that never leave my Class**

SSH (attach shell) to the running `redis` docker container, and run the command:

```sh
redis-cli flushall
```

# Cordova

This section describes how to prepare and build the cordova apps for iOS and Android inside this repository.

## Prerequisites

### Generic

```sh
mkdir www
```

This folder is required for Cordova to recognise the project.

Install the Cordova CLI by following these [instructions](https://cordova.apache.org/docs/en/10.x/guide/cli/index.html#installing-the-cordova-cli).

Once these are complete, move onto the steps described for the desired platform to ensure all prerequisites are installed on the developer machine for each platform.

### Android

**Official Cordova documentation**

The easiest way to install all the Android requirements is to follow the official cordova documentation. This can be found at this URL: https://cordova.apache.org/docs/en/10.x/guide/platforms/android/index.html#installing-the-requirements

**Verifying all the requirements is in place**

Run the following command to verify the Android prerequisites are available and configured:

```sh
cordova requirements android
```

Fix any missing requirements the previous command detected and then move on to the Building section.

### iOS

**Official Cordova documentation**

The easiest way to install all the iOS requirements is to follow the official cordova documentation. This can be found at this URL: https://cordova.apache.org/docs/en/10.x/guide/platforms/ios/index.html#installing-the-requirements

**Verifying all the requirements is in place**

Run the following command to verify the iOS prerequisites are available and configured:

```sh
cordova requirements ios
```

Fix any missing requirements the previous command detected and then move on to the Building section.

## Troubleshooting

### Missing DX

```text
Build-tool 31.0.0 is missing DX at /lib/Android/Sdk/build-tools/31.0.0/dx

FAILURE: Build failed with an exception.

-   What went wrong:
    Could not determine the dependencies of task ':app:compileDebugJavaWithJavac'.
    > Installed Build Tools revision 31.0.0 is corrupted. Remove and install again using the SDK Manager.
```

```sh
# change below to your Android SDK path
ANDROID_SDK_HOME=/usr/lib/Android/Sdk
cd ANDROID_SDK_HOME/build-tools/31.0.0 \
  && sudo mv d8 dx \
  && cd lib  \
  && sudo mv d8.jar dx.jar
```

### Android resource linking failed

```text
> Task :app:processDebugResources FAILED

FAILURE: Build failed with an exception.

-   What went wrong:
    Execution failed for task ':app:processDebugResources'.
    > A failure occurred while executing com.android.build.gradle.internal.tasks.Workers$ActionFacade
    > Android resource linking failed
         kidsloop-live-frontend/platforms/android/app/src/main/AndroidManifest.xml:13:13-112: AAPT: error: resource xml/file_paths (aka com.kidsloop.platform.student:xml/file_paths) not found.
```

Perform the following before re-running the build script.

```sh
rm -rf plugins
rm -rf platforms
```

### Unrecognized Attribute name MODULE

```text
> Task :app:compileDebugJavaWithJavac FAILED
An exception has occurred in the compiler (1.8.0_292). Please file a bug against the Java compiler via the Java bug reporting page (http://bugreport.java.com) after checking the Bug Database (http://bugs.java.com) for duplicates. Include your program and the following diagnostic in your report. Thank you.
java.lang.AssertionError: annotationType(): unrecognized Attribute name MODULE (class com.sun.tools.javac.util.UnsharedNameTable$NameImpl)
        at com.sun.tools.javac.util.Assert.error(Assert.java:133)
```

Check the `export ORG_GRADLE_PROJECT_cdvCompileSdkVersion=31` line in the build script file, and reduce the version number (e.g. to 29 or 30).

Note, you will need to make sure the corresponding Android SDK is installed (e.g. 29 = Android 10.0 - Q).

### Broken images in app output

Ensure `git lfs` is setup (see Local Setup - Prerequisites), then rebuild the application.

## Building for Development

Building for development is separated in two different steps. One step to generate the native platform project and files and another step to build the native applications. In the KidsLoop Live repository there's scripts to help do these steps.

### Android

Execute the following command to build a development `apk` file:

```sh
./scripts/build-android-development.sh
```

If there wasn't any errors the command will produce an `apk` file in this location:

```
./platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

This file can be installed on device or emulator using the command:

```sh
adb install -r ./platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

### iOS

Execute the following command to build and open a XCode project:

```sh
./scripts/build-ios-development.sh
```

If there wasn't any errors the command will open the generated XCode project. Use the XCode project to debug or archive the `ipa` file as usual.

## Building for Production

### Android

Execute the following command to build a production `aab` file:

```sh
./scripts/build-android-release.sh
```

If there wasn't any errors the command will produce an `aab` file in this location:

```
./platforms/android/app/build/outputs/bundle/release/app-release.aab
```

This file can then be uploaded to Google Play using the Google Play developer console.

### iOS

Execute the following command to build and open a XCode project:

```sh
./scripts/build-ios-development.sh
```

If there wasn't any errors the command will open the generated XCode project.

**Add build phase script to remove x86 architectures from included frameworks**

Go to the project properties and `Build Phases` page in XCode. Add the following script as a last `Build Phase`:

```sh
echo "Target architectures: $ARCHS"

APP_PATH="${TARGET_BUILD_DIR}/${WRAPPER_NAME}"

find "$APP_PATH" -name '*.framework' -type d | while read -r FRAMEWORK
do
FRAMEWORK_EXECUTABLE_NAME=$(defaults read "$FRAMEWORK/Info.plist" CFBundleExecutable)
FRAMEWORK_EXECUTABLE_PATH="$FRAMEWORK/$FRAMEWORK_EXECUTABLE_NAME"
echo "Executable is $FRAMEWORK_EXECUTABLE_PATH"
echo $(lipo -info "$FRAMEWORK_EXECUTABLE_PATH")

FRAMEWORK_TMP_PATH="$FRAMEWORK_EXECUTABLE_PATH-tmp"

# remove simulator's archs if location is not simulator's directory
case "${TARGET_BUILD_DIR}" in
*"iphonesimulator")
    echo "No need to remove archs"
    ;;
*)
    if $(lipo "$FRAMEWORK_EXECUTABLE_PATH" -verify_arch "i386") ; then
    lipo -output "$FRAMEWORK_TMP_PATH" -remove "i386" "$FRAMEWORK_EXECUTABLE_PATH"
    echo "i386 architecture removed"
    rm "$FRAMEWORK_EXECUTABLE_PATH"
    mv "$FRAMEWORK_TMP_PATH" "$FRAMEWORK_EXECUTABLE_PATH"
    fi
    if $(lipo "$FRAMEWORK_EXECUTABLE_PATH" -verify_arch "x86_64") ; then
    lipo -output "$FRAMEWORK_TMP_PATH" -remove "x86_64" "$FRAMEWORK_EXECUTABLE_PATH"
    echo "x86_64 architecture removed"
    rm "$FRAMEWORK_EXECUTABLE_PATH"
    mv "$FRAMEWORK_TMP_PATH" "$FRAMEWORK_EXECUTABLE_PATH"
    fi
    ;;
esac

echo "Completed for executable $FRAMEWORK_EXECUTABLE_PATH"
echo $(lipo -info "$FRAMEWORK_EXECUTABLE_PATH")

done
```

**Disable Validate Workspace**

Find the settings `Validate Workspace` in XCode project settings. Set the value to `No`. Doing this will prevent XCode failing the build due to issue with the included `cordova-plugin-iosrtc` framework.

**Configure Code Signing**

The KidsLoop distribution certificate with private key have to be in the `Key Chain` before doing this step. Configure the code signing as illustrated in this image:

![Alt text](docs/code-signing-config-ios.png "Code Signing Configuration")

**Archive the iOS binary**

Now it's possible to archive the binary and then distribute and upload to App Store as usual.

## Pull Request Process

### General : WHat to know when opening a PR

1. Point your PR to `main` branch
2. Respect the PR title format : e.g. `fix(TICKET): Short but meaningful description`. You can refer to [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). And double check the title of your PR, this title will be included in the release note of our product. It has to be understood by non-technical people.
3. Make sure your PR is ready for review before creating a PR. Or open a `draft` PR if necessary.
4. Give your PR a description if necessary.
5. Give your PR a label if necessary : e.g. `Do Not Merge` if the PR is not supposed to be included in the next version.
6. A PR can be `squashed and merged` if it passes the pipeline checks but most important check is being reviewed by 2 or more CODEOWNERS.
7. If your PR stay pending for a while, make sure to solve any conflicts and rebase with `main` branch if necessary.

The Pull Request Process can change slightly depending on the current priorities. In average you can expect your PR to be merge within 72 hours.

### External teams

KidsLoop CODEOWNERS have a time slot for reviewing carefuly the work from external teams but feel free to ask questions before opening a PR if it makes the process easier or you're not sure if you're work will match KidsLoop codebase. Make sure you review your code with your internal team or supervisor (draft PR) before opening the PR for KidsLoop team.

As KidsLoop CODEOWNERS might not be aware of the current goals for external teams, please reach out if some PR are in a urgent state or a specific PR needs to be reviewed in priority. Do it only after confirmation with KidsLoop product and delivery team.

For any technical questions please contact the CODEOWNERS.

## Code review

### Best practices 

To respect the KidsLoop codebase, here's a few key points to follow when creating code in the `kidsloop-live-frontend` repository:
1. Re-use components or refactor existent if what you want to achieve is slightly different.
2. Re-use color variables instead of creating new ones. See `/config/index.ts`.
3. Make components as small and dumb as possible.
4. Create easy and understandable function names and variable names.
5. Don’t use inline styles. Prefer to css `class` instead.
6. Use `theme.spacing(X)` instead of `px` for font sizes, margins and padding.
7. Respect the naming convention from folders and file names.