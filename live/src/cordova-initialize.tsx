import { useState, useEffect, useCallback } from "react";

const useCordovaInitialize = () => {
    const [cordovaReady, setCordovaReady] = useState(false);
    const [permissions, setPermissions] = useState(false);

    const requestPermissions = useCallback((camera: boolean, mic: boolean) => {
        const cordova = (window as any).cordova;
        if (cordova && cordova.plugins && cordova.plugins.iosrtc) {
            console.log("Requesting iosrtc permissions...")
            cordova.plugins.iosrtc.requestPermission(mic, camera, (approved: boolean) => {
                console.log("Permissions: ", approved ? "Granted" : "Rejected");
                setPermissions(approved);
            });
        } else {
            setPermissions(true);
        }
    }, [setPermissions]);

    useEffect(() => {
        if (!cordovaReady) return;

        const cordova = (window as any).cordova;
        if (!cordova || !cordova.plugins || !cordova.plugins.iosrtc) return;

        const refreshVideos = setInterval(() => {
            // NOTE: This function must be called when any video element layout changes. Because on iOS
            // the videos is just overlayed on top of the page content. Commented for now because it 
            // pollutes the log.
            // cordova.plugins.iosrtc.refreshVideos();
        }, 100);

        return () => {
            clearInterval(refreshVideos);
        }
    }, [cordovaReady]);

    useEffect(() => {
        console.log("Waiting for deviceready event...");

        const onDeviceReady = async () => {
            console.log("Received deviceready event!");

            const cordova = (window as any).cordova;
            if (cordova && cordova.plugins && cordova.plugins.iosrtc) {
                console.log("Registering iosrtc globals.");
                cordova.plugins.iosrtc.registerGlobals();
                // cordova.plugins.iosrtc.debug.enable("*", true);
            }

            setCordovaReady(true);

            requestPermissions(true, true);
        };

        document.addEventListener("deviceready", onDeviceReady, false);

        return () => {
            document.removeEventListener("deviceready", onDeviceReady);
        }
    }, []);

    return [cordovaReady, permissions, requestPermissions];
};

export default useCordovaInitialize;
