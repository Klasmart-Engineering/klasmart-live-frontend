import { useState, useEffect, useCallback } from "react";
import useVideoLayoutUpdate from "./utils/video-layout-update";

const useCordovaInitialize = (backExitApplication?: boolean, callbackBackButton?: () => void, skipInitEffects?: boolean) => {
    const [cordovaReady, setCordovaReady] = useState(false);
    const [permissions, setPermissions] = useState(false);
    const [keepAwake, setKeepAwake] = useState(true);

    const { updateLayout } = useVideoLayoutUpdate(null);

    const enableAndroidFullScreen = () => {
        // cordova-plugin-fullscreen
        const AndroidFullScreen = (window as any).AndroidFullScreen;
        if (AndroidFullScreen) {
            AndroidFullScreen.isSupported(() => {
                AndroidFullScreen.immersiveMode(() => {
                    console.log("Successfully set immersiveMode");
                }, () => {
                    console.error("Failed to set immersiveMode");
                });
            }, (error: Error) => {
                console.log(`AndroidFullScreen not available: ${error}`)
            });
        }
    }

    const requestIosCameraPermission = useCallback((camera: boolean, mic: boolean) => {
        const cordova = (window as any).cordova;
        if (!cordova || !cordova.plugins) return;

        if (cordova.plugins.iosrtc) {
            console.log("Requesting iosrtc permissions...")
            cordova.plugins.iosrtc.requestPermission(mic, camera, (approved: boolean) => {
                console.log("Permissions: ", approved ? "Granted" : "Rejected");
                setPermissions(approved);
            });
        }
    }, [setPermissions]);

    const requestPermissions = useCallback((camera: boolean, mic: boolean) => {
        const cordova = (window as any).cordova;
        if (!cordova || !cordova.plugins) return;

        if (cordova.plugins.permissions) {
            console.log("Requesting android permissions...")
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
                console.error(`Couldn't request permissions: ${permissionsList}`)
            };

            const onRequestSuccess = (status: { hasPermission: boolean }) => {
                console.log(`Successfully requested permissions: ${JSON.stringify(permissionsList)} ${status.hasPermission}`);
                setPermissions(status.hasPermission);
            };

            permissions.requestPermissions(permissionsList, onRequestSuccess, onRequestError);
        } else {
            requestIosCameraPermission(camera, mic);
        }
    }, [setPermissions]);

    useEffect(() => {
        if (skipInitEffects) return;

        console.log("Waiting for deviceready event...");

        const onDeviceReady = async () => {
            console.log("Received deviceready event!");

            enableAndroidFullScreen();

            const cordova = (window as any).cordova;

            if (cordova && cordova.plugins && cordova.plugins.iosrtc) {
                console.log("Registering iosrtc globals.");
                cordova.plugins.iosrtc.registerGlobals();
            }

            // NOTE: Copy cookies for iOS webview.
            const wkWebView = (window as any).wkWebView;
            if (wkWebView) {
                wkWebView.injectCookie('kidsloop.net/refresh');
                wkWebView.injectCookie('kidsloop.net/');
                wkWebView.injectCookie('auth.alpha.kidsloop.net/refresh');
                wkWebView.injectCookie('.alpha.kidsloop.net/');
                wkWebView.injectCookie('kidsloop.live/refresh');
                wkWebView.injectCookie('.kidsloop.live/');
            }

            setCordovaReady(true);
        };

        document.addEventListener("deviceready", onDeviceReady, false);

        return () => {
            document.removeEventListener("deviceready", onDeviceReady);
        }
    }, []);

    useEffect(() => {
        if (skipInitEffects) return;

        const onBackButton = (e: Event) => {
            if (!backExitApplication) {
                e.preventDefault();
            }

            if (callbackBackButton) {
                callbackBackButton();
            }
        };

        document.addEventListener("backbutton", onBackButton, false);

        return () => {
            document.removeEventListener("backbutton", onBackButton);
        }

    }, [backExitApplication, callbackBackButton]);

    useEffect(() => {
        const vu = setInterval(() => {
            updateLayout();
        }, 50);

        return () => {
            clearInterval(vu);
        };
    }, []);

    useEffect(() => {
        if (skipInitEffects) return;

        const plugins = (window as any).plugins;
        if (!plugins) return;

        try {
            if (keepAwake) {
                (window as any).plugins.insomnia.keepAwake();
            } else {
                (window as any).plugins.insomnia.allowSleepAgain();
            }
        } catch (error) {
            console.error(error);
        }
    }, [keepAwake]);

    return { cordovaReady, permissions, requestPermissions, requestIosCameraPermission, keepAwake, setKeepAwake };
};

export default useCordovaInitialize;
