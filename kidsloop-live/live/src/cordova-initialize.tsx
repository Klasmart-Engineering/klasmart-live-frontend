import { useState, useEffect } from "react";

const useCordovaInitialize = () => {
    const [cordovaReady, setCordovaReady] = useState(false);

    useEffect(() => {
        console.log("Waiting for deviceready event...");

        const onDeviceReady = async () => {
            console.log("Received deviceready event!");

            const cordova = (window as any).cordova;
            if (cordova && cordova.plugins && cordova.plugins.iosrtc) {
                console.log("Registering iosrtc globals.");
                cordova.plugins.iosrtc.registerGlobals();
                cordova.plugins.iosrtc.debug.enable("*", true);
            }

            setCordovaReady(true);

            console.log("Enumerating media devices...");
            navigator.mediaDevices.enumerateDevices().then((devices) => {
                console.log("Found: " + devices.length + " devices:");

                devices.forEach(device => {
                    console.log(JSON.stringify(device));
                });
            }, (reason) => {
                console.error(reason);
            });
        };

        document.addEventListener("deviceready", onDeviceReady, false);

        return () => {
            document.removeEventListener("deviceready", onDeviceReady);
        }
    }, []);

    return [cordovaReady];
};

export default useCordovaInitialize;
