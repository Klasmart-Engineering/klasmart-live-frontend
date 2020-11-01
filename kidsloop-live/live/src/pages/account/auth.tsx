import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useEffect, useRef } from "react";

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
        if (!useInAppBrowser) return;

        const cordova = (window as any).cordova;
        if (!cordova) return;

        const browser = cordova.InAppBrowser.open(AuthEndpoint, '_blank', 'location=no,zoom=no');

        const onStop = () => {
            refresh();
        };

        // params = InAppBrowserEvent
        const onMessage = (params: any) => {
            const messageData = params.data;
            if (messageData === "message") {
                refresh();

                browser.close();
            }
        };

        browser.addEventListener("stop", onStop, false);
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