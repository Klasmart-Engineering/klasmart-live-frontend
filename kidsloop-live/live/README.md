# Tokens for testing teacher / student

Teacher: http://localhost:8080/?token=eyJhbGciOiJIUzI1NiJ9.eyJ0ZWFjaGVyIjp0cnVlLCJtYXRlcmlhbHMiOlt7Im5hbWUiOiJNYXRlcmlhbCAxIiwidXJsIjoiL2g1cC9wbGF5LzVlY2Y0ZTRiNjExZTE4Mzk4ZjczODBlZiJ9XSwicm9vbUlkIjoicm9vbTAxIn0.QicJnme4iNNXSKkXyOW4rGMOkKrSwVITXLYLevXjEYg

Student: http://localhost:8080/?token=eyJhbGciOiJIUzI1NiJ9.eyJ0ZWFjaGVyIjpmYWxzZSwibWF0ZXJpYWxzIjpbeyJuYW1lIjoiTWF0ZXJpYWwgMSIsInVybCI6Ii9oNXAvcGxheS81ZWNmNGU0YjYxMWUxODM5OGY3MzgwZWYifV0sInJvb21JZCI6InJvb20wMSJ9.3_LBVx8poa0yQd6Jgy8w2bMDywLl0NDAH98pdmpX17E

# Build Cordova Application

## Android

### Prerequirements

- Cordova: `npm install -g cordova`
- Android SDK
- JDK
- Gradle

### Verify Requirements

#### Cordova

\$ `cordova -v`\
`10.0.0`

#### Android SDK

\$ `echo $ANDROID_SDK_ROOT`\
`/home/axel/Android/Sdk`

#### JDK

\$ `java -version`\
`openjdk version "1.8.0_265"`\
`OpenJDK Runtime Environment (build 1.8.0_265-b01)`\
`OpenJDK 64-Bit Server VM (build 25.265-b01, mixed mode)`

#### Gradle

\$ `gradle -v`\
`------------------------------------------------------------`\
`Gradle 6.6\`\
`------------------------------------------------------------`\
` `\
`Build time: 2020-08-24 18:57:56 UTC`\
`Revision: <unknown>`\
` `\
`Kotlin: 1.3.72`\
`Groovy: 2.5.12`\
`Ant: Apache Ant(TM) version 1.10.8 compiled on May 10 2020`\
`JVM: 14.0.2 (Oracle Corporation 14.0.2+12)`\
`OS: Linux 5.8.10-arch1-1 amd64`

### Building

After cloning the repository some of the platforms, plugins, or directorys required by cordova might not be there. The `cordova prepare` command can be used to prepare the cordova project.

First ensure that the required platform is installed. This can be verified using cordova CLI.

\$ `cordova platform ls`\
`6.0.0`\
`Installed platforms:`\
` android 9.0.0`\
` browser`\
`Available platforms: `\
` browser ^6.0.0`\
` electron ^1.0.0`\

If the `android` platform isn't listed it can be installed using:\
\$ `cordova platform add android`

The cordova application is set up to be built using webpack first and then packaged into .apk file for distribution. Only developmen builds is set up for now.

Also before building using webpack, some environment variables will have to be set, to allow the application to connect services which isn't hosted on the target device. Usually these request would be redirected by the `webpack-dev-server`.

List of variables:

- ENDPOINT_WEBSOCKET -- Where to connect to graphql websocket.
- ENDPOINT_GQL -- Where to connect to graphql.
- ENDPOINT_H5P -- Where to retrieve H5P activities.
- ENDPOINT_SFU -- Where to connect to SFU.
- USE_TEST_TOKEN -- Use the test token (until we've added login/qr page).
- DISABLE_BROWSER_GUIDE -- Don't display the browser guide page.
- WEBRTC_DEVICE_HANDLER_NAME -- Used to manually specify which device handler should be used. (Chrome74, Chrome70, Chrome67, Chrome55, Firefox60, Safari12, Safari11, Edge11, ReactNative)

After defining these variables the `build:app` npm command can run. This will only do the webpack build step. Once complete, cordova `build android` command can be run to
create the `apk` file.

#### Example Building Webpack

\$ `ENDPOINT_SFU=wss://live.kidsloop.net/sfu ENDPOINT_WEBSOCKET=wss://live.kidsloop.net/graphql ENDPOINT_GQL=https://live.kidsloop.net/graphql ENDPOINT_H5P=https://live.kidsloop.net/h5p USE_TEST_TOKEN=1 DISABLE_BROWSER_GUIDE=1 npm run build:app`

#### Example Running

\$ `cordova run android`

#### Example Building

\$ `cordova build android`

### Running

The permissions required to access camera is defined in the Android manifest, but the application doesn't ask for permission automatically yet. So before running those permissions will have to be granted in the app settings. Otherwise the camra and microphone wont be visible.


### Troubleshooting

#### Current working directory is not a Cordova-based project.
This issue usually happens after cloning the repository. Cordova try to find the `www` folder when preparing or building. If the `www` folder isn't present this error will happen.

##### Solution
Create the `www` folder and try again.

\$ `mkdir www`
