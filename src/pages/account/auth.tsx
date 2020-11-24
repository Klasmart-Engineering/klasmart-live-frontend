import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { OrientationType } from "../../store/actions";
import { lockOrientation } from "../../utils/screenUtils";

const useStyles = makeStyles((_theme) => createStyles({
    container: {
        margin: 0,
        padding: 0,
        height: "100%",
        width: "100%",
        overflow: "none",
    }
}),
);

const AuthEndpoint = "https://auth.kidsloop.net";

interface Props {
    refresh: () => void;
    useInAppBrowser: boolean;
}

export function Auth({ refresh, useInAppBrowser }: Props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const frameRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (!frameRef.current) return;

        const contentWindow = frameRef.current.contentWindow;
        if (!contentWindow) return;

        const parent = contentWindow.parent;
        if (!parent) return;

        const onMessage = (event: MessageEvent) => {
            const { data, origin } = event;

            if (origin === AuthEndpoint && data.message === "message") {
                console.log('refreshing auth status');
                refresh();
            }
        };

        parent.addEventListener("message", onMessage, false);

        return () => {
            parent.removeEventListener("message", onMessage);
        }
    }, [frameRef.current]);

    useEffect(() => {
        lockOrientation(OrientationType.PORTRAIT, dispatch);
        if (!useInAppBrowser) return;

        const cordova = (window as any).cordova;
        let browser: any;
        if (!cordova) return;
        cordova.plugins.browsertab.isAvailable((result: any) => {
            if (!result) {
                browser = cordova.InAppBrowser.open(AuthEndpoint, '_system', 'location=no,zoom=no');
            } else {
                cordova.plugins.browsertab.openUrl(
                    AuthEndpoint,
                    (successResp: any) => { console.log(successResp) },
                    (failureResp: any) => {
                        console.error("no browser tab available");
                    }
                )
            }
        });
                
        const onExit = () => {
            refresh();
        };

        // params = InAppBrowserEvent
        const onMessage = (params: any) => {
            const messageData = params.data;
            if (messageData.message === "message") {
                refresh();

                browser.close();
            }
        };

        browser.addEventListener("exit", onExit, false);
        browser.addEventListener("message", onMessage, false);
    }, []);

    if (useInAppBrowser) {
        return (
            <>Waiting for authentication...</>
        );
    } else {
        return (
            <div className={classes.container}>
                <iframe ref={frameRef} width="100%" height="100%" frameBorder="0" src={AuthEndpoint}></iframe>
            </div>
        );
    }
}