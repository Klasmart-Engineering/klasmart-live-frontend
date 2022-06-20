import { THEME_COLOR_BACKGROUND_ON_BOARDING, THEME_COLOR_BACKGROUND_PAPER } from "@/config";
import { OrientationType } from "../model/appModel";

export function lockOrientation (orientationType: OrientationType) {
    if (screen.orientation && screen.orientation.lock) {
        screen.orientation.lock(orientationType)
            .catch((err) => {
                console.warn(`Since this platform is not Cordova, screen.orientation.lock() will not work.`, err);
            });
    }
}

export function enableFullScreen (enabled:boolean, isAuthenticated: boolean) {
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
        StatusBar.hide();
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
        StatusBar.backgroundColorByHexString(isAuthenticated ? THEME_COLOR_BACKGROUND_PAPER : THEME_COLOR_BACKGROUND_ON_BOARDING);
        StatusBar.show();

        setTimeout(() => {
            StatusBar.styleDefault();
        }, 100);

    }
}

export function enableKeepAwake (enabled:boolean) {
    const plugins = (window as any).plugins;
    if (!plugins) return;

    const insomnia = (window as any).plugins.insomnia;
    if (!insomnia) return;

    if (enabled) {
        insomnia.keepAwake();
    }else{
        insomnia.allowSleepAgain();
    }
}
