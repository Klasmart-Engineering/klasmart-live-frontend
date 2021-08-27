import { useHttpEndpoint } from "../../context-provider/region-select-context";
import { useUserInformation } from "../../context-provider/user-information-context";
import { OrientationType } from "../../store/actions";
import { lockOrientation } from "../../utils/screenUtils";
import { Grid } from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React,
{
    useEffect,
    useRef, 
, useState
} from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { ParentalGate } from "src/app/dialogs/parentalGate";
import Loading from "src/components/loading";

const useStyles = makeStyles((_theme) => createStyles({
    container: {
        margin: 0,
        padding: 0,
        height: `100%`,
        width: `100%`,
        overflow: `none`,
    },
}));

const CUSTOM_UA = process.env.CUSTOM_UA || `cordova`;

interface Props {
    useInAppBrowser: boolean;
}

export function Auth({ useInAppBrowser }: Props) {
    const classes = useStyles();
    const dispatch = useDispatch();
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [key, setKey] = useState(Math.random().toString(36));

    const authEndpoint = useHttpEndpoint(`auth`);

    const {
        loading,
        authenticated,
        actions,
    } = useUserInformation();

    const [completedParentalChallenge, setCompletedParentalChallenge] = useState<boolean>(false);

    useEffect(() => {
        if (!frameRef.current) return;

        const contentWindow = frameRef.current.contentWindow;
        if (!contentWindow) return;

        const parent = contentWindow.parent;
        if (!parent) return;

        const onMessage = (event: MessageEvent) => {
            const { data, origin } = event;

            if (origin === authEndpoint && data.message === `message`) {
                console.log(`refreshing auth status`);
                actions?.refreshAuthenticationToken();
            }
        };

        parent.addEventListener(`message`, onMessage, false);

        return () => {
            parent.removeEventListener(`message`, onMessage);
        };
    }, [frameRef.current]);

    useEffect(() => {
        if (loading) return;
        if (authenticated) return;

        lockOrientation(OrientationType.PORTRAIT, dispatch);
        if (!useInAppBrowser) return;

        if (!completedParentalChallenge) return;

        const cordova = (window as any).cordova;
        if (!cordova) return;

        let browser: any;
        cordova.plugins.browsertab.isAvailable((result: any) => {
            if (!result) {
                browser = cordova.InAppBrowser.open(authEndpoint, `_system`, `location=no,zoom=no`);
            } else {
                cordova.plugins.browsertab.openUrl(`${authEndpoint}/?ua=${CUSTOM_UA}`, (successResp: any) => { console.log(successResp); }, (failureResp: any) => {
                    console.error(`no browser tab available`);
                    console.error(failureResp);
                });
            }
        });

        const onExit = () => {
            actions?.refreshAuthenticationToken();
        };

        // params = InAppBrowserEvent
        const onMessage = (params: any) => {
            const messageData = params.data;
            if (messageData.message === `message`) {
                actions?.refreshAuthenticationToken();

                browser.close();
            }
        };

        if (browser) {
            browser.addEventListener(`exit`, onExit, false);
            browser.addEventListener(`message`, onMessage, false);
        }
    }, [
        key,
        authenticated,
        loading,
        completedParentalChallenge,
    ]);

    if (!loading && !authenticated && !completedParentalChallenge) {
        return <ParentalGate onCompleted={() => { setCompletedParentalChallenge(true); }} />;
    }

    if (useInAppBrowser) {
        return (
            <Grid
                container
                item
                direction="row"
                alignItems="center"
                style={{
                    height: `100%`
                }}
                spacing={2}>
                <Loading
                    messageId="auth_waiting"
                    retryCallback={() => setKey(Math.random().toString(36))} />
                {authenticated ? <Redirect to="/" /> : <></>}
            </Grid>
        );
    } else {
        return (
            <div className={classes.container}>
                <iframe
                    ref={frameRef}
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    src={authEndpoint}></iframe>
            </div>
        );
    }
}
