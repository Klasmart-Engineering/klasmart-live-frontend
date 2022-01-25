import { isKeyboardVisibleState } from "../model/appModel";
import useVideoLayoutUpdate from "./../utils/video-layout-update";
import { Device } from "@/app/types/device";
import {
    useCallback,
    useEffect,
    useState,
} from "react";
import { useSetRecoilState } from "recoil";

declare let device: Device; // device from plugin cordova-plugin-device

const useCordovaInitialize = (backExitApplication?: boolean, callbackBackButton?: () => void, skipInitEffects?: boolean) => {
    const [ cordovaReady, setCordovaReady ] = useState(false);
    const [ permissions, setPermissions ] = useState(false);
    const [ isIOS, setIsIOS ] = useState<boolean>(false);
    const [ isAndroid, setIsAndroid ] = useState<boolean>(false);
    const [ deviceInfo, setDeviceInfo ] = useState<Device>();
    const setKeyboardVisible = useSetRecoilState(isKeyboardVisibleState);

    const { updateLayout } = useVideoLayoutUpdate(null);

    const requestIosCameraPermission = useCallback((camera: boolean, mic: boolean) => {
        const cordova = (window as any).cordova;
        if (!cordova || !cordova.plugins) return;

        if (cordova.plugins.iosrtc) {
            console.log(`Requesting iosrtc permissions...`);
            cordova.plugins.iosrtc.requestPermission(mic, camera, (approved: boolean) => {
                console.log(`Permissions: `, approved ? `Granted` : `Rejected`);
                setPermissions(approved);
            });
        }
    }, [ setPermissions ]);

    const requestPermissions = useCallback((camera: boolean, mic: boolean) => {
        const cordova = (window as any).cordova;
        if (!cordova || !cordova.plugins) return;

        if (cordova.plugins.permissions) {
            console.log(`Requesting android permissions...`);
            const permissions = cordova.plugins.permissions;

            const permissionsList: string[] = [];
            if (camera) {
                permissionsList.push(permissions.CAMERA);
            }

            if (mic) {
                permissionsList.push(permissions.RECORD_AUDIO);
                permissionsList.push(permissions.MODIFY_AUDIO_SETTINGS);
            }

            const onRequestError = () => {
                console.error(`Couldn't request permissions: ${permissionsList}`);
            };

            const onRequestSuccess = (status: { hasPermission: boolean }) => {
                console.log(`Successfully requested permissions: ${JSON.stringify(permissionsList)} ${status.hasPermission}`);
                setPermissions(status.hasPermission);
            };

            permissions.requestPermissions(permissionsList, onRequestSuccess, onRequestError);
        } else {
            requestIosCameraPermission(camera, mic);
        }
    }, [ setPermissions ]);

    useEffect(() => {
        if (skipInitEffects) return;

        console.log(`Waiting for deviceready event...`);

        const onDeviceReady = async () => {
            console.log(`Received deviceready event!`);

            const cordova = (window as any).cordova;

            // enableFullScreen(false);

            if (cordova && cordova.plugins && cordova.plugins.iosrtc) {
                console.log(`Registering iosrtc globals.`);
                cordova.plugins.iosrtc.registerGlobals();
            }

            // NOTE: Copy cookies for iOS webview.
            const wkWebView = (window as any).wkWebView;
            if (wkWebView) {
                wkWebView.injectCookie(`kidsloop.net/refresh`);
                wkWebView.injectCookie(`kidsloop.net/`);
                wkWebView.injectCookie(`auth.alpha.kidsloop.net/refresh`);
                wkWebView.injectCookie(`.alpha.kidsloop.net/`);
                wkWebView.injectCookie(`kidsloop.live/refresh`);
                wkWebView.injectCookie(`.kidsloop.live/`);
                wkWebView.injectCookie(`kidsloop.vn/refresh`);
                wkWebView.injectCookie(`.kidsloop.vn/`);
                wkWebView.injectCookie(`kidsloop.in/refresh`);
                wkWebView.injectCookie(`.kidsloop.in/`);
            }

            setIsAndroid(cordova.platformId === `android`);
            setIsIOS(cordova.platformId === `ios`);
            setDeviceInfo(device);

            setCordovaReady(true);

            const SplashScreen = (navigator as any).splashscreen;
            if (SplashScreen) {
                SplashScreen.hide();
            }

            window.addEventListener(`keyboardWillShow`, (event) => {
                setKeyboardVisible(true);
            });

            window.addEventListener(`keyboardWillHide`, (event) => {
                setKeyboardVisible(false);
            });

        };

        document.addEventListener(`deviceready`, onDeviceReady, false);

        return () => {
            document.removeEventListener(`deviceready`, onDeviceReady);
        };
    }, []);

    useEffect(() => {
        if (skipInitEffects) return;

        const onBackButton = (e: Event) => {
            if (!backExitApplication) {
                e.preventDefault();
            }
            callbackBackButton?.();
        };

        document.addEventListener(`backbutton`, onBackButton, false);

        return () => {
            document.removeEventListener(`backbutton`, onBackButton);
        };

    }, [ backExitApplication, callbackBackButton ]);

    useEffect(() => {
        const vu = setInterval(() => {
            updateLayout();
        }, 50);

        return () => {
            clearInterval(vu);
        };
    }, []);

    return {
        cordovaReady,
        permissions,
        requestPermissions,
        requestIosCameraPermission,
        isIOS,
        isAndroid,
        deviceInfo,
    };
};

export default useCordovaInitialize;
