import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { OrientationType } from "../../store/actions";
import { lockOrientation } from "../../utils/screenUtils";
import Loading from "../../components/loading";
import { useState } from "react";
import Button from "@material-ui/core/Button";
import { useHttpEndpoint } from "../../context-provider/region-select-context";

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

interface Props {
    refresh: () => void;
    useInAppBrowser: boolean;
}

export function Auth({ refresh, useInAppBrowser }: Props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [key, setKey] = useState(Math.random().toString(36));

    const authEndpoint = useHttpEndpoint("auth");

    useEffect(() => {
        if (!frameRef.current) return;

        const contentWindow = frameRef.current.contentWindow;
        if (!contentWindow) return;

        const parent = contentWindow.parent;
        if (!parent) return;

        const onMessage = (event: MessageEvent) => {
            const { data, origin } = event;

            if (origin === authEndpoint && data.message === "message") {
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
                browser = cordova.InAppBrowser.open(authEndpoint, '_system', 'location=no,zoom=no');
            } else {
                cordova.plugins.browsertab.openUrl(
                    `${authEndpoint}/?ua=cordova#/`,
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

        if (browser) {
            browser.addEventListener("exit", onExit, false);
            browser.addEventListener("message", onMessage, false);
        }
    }, [key]);

    if (useInAppBrowser) {
        return (
            <>
                <Loading rawText="Waiting for authentication...">
                    <Button onClick={() => setKey(Math.random().toString(36))}>Try again</Button>
                </Loading>
            </>
        );
    } else {
        return (
            <div className={classes.container}>
                <iframe ref={frameRef} width="100%" height="100%" frameBorder="0" src={authEndpoint}></iframe>
            </div>
        );
    }
}