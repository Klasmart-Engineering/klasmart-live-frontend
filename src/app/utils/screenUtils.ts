import { OrientationType } from "../model/appModel";

export function lockOrientation (orientationType: OrientationType) {
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock(orientationType)
            .catch((err) => {
                console.warn(`Since this platform is not Cordova, screen.orientation.lock() will not work.`, err);
            });
    }
}

export function enableFullScreen (enabled:boolean) {
    const StatusBar = (window as any).StatusBar;
    const AndroidFullScreen = (window as any).AndroidFullScreen;

    if(!StatusBar) return;

    if (enabled) {
        if (AndroidFullScreen) {
            AndroidFullScreen.isSupported(() => {
                AndroidFullScreen.immersiveMode(() => {
                    console.log(`Successfully set immersiveMode`);
                }, () => {
                    console.error(`Failed to set immersiveMode`);
                });
            }, (error: Error) => {
                console.log(`AndroidFullScreen not available: ${error}`);
            });
        }

        StatusBar.overlaysWebView(true);
    }else{
        if (AndroidFullScreen) {
            AndroidFullScreen.isSupported(() => {
                AndroidFullScreen.showSystemUI(() => {
                    console.log(`Successfully set default mode`);
                }, () => {
                    console.error(`Failed to set default mode`);
                });
            }, (error: Error) => {
                console.log(`AndroidFullScreen not available: ${error}`);
            });
        }

        StatusBar.overlaysWebView(false);
        StatusBar.backgroundColorByHexString(`#fff`);

        setTimeout(() => {
            StatusBar.styleDefault();
        }, 100);

    }
}

export function enableKeepAwake (enabled:boolean) {
    const plugins = (window as any).plugins;
    if (!plugins) return;

    const insomnia = (window as any).plugins.insomnia;

    if (enabled) {
        insomnia.keepAwake();
    }else{
        insomnia.allowSleepAgain();
    }
}
