import { useHttpEndpoint } from "../../../providers/region-select-context";
import { DevSelectRegion } from "../../components/auth/devSelectRegion";
import LoadingWithRetry from "../../components/loadingWithRetry";
import { useAuthenticationContext } from "../../context-provider/authentication-context";
import { ParentalGate } from "../../dialogs/parentalGate";
import {
    localeState,
    OrientationType,
} from "../../model/appModel";
import { lockOrientation } from "../../utils/screenUtils";
import {
    Grid,
    useTheme,
} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React,
{
    useEffect,
    useRef,
    useState,
} from "react";
import { Redirect } from "react-router-dom";
import { useRecoilValue } from "recoil";

const useStyles = makeStyles(() => createStyles({
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

export function Auth ({ useInAppBrowser }: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [ key, setKey ] = useState(Math.random().toString(36));
    const locale = useRecoilValue(localeState);

    const authEndpoint = useHttpEndpoint(`auth`);

    const {
        loading,
        authenticated,
        actions,
    } = useAuthenticationContext();

    const [ completedParentalChallenge, setCompletedParentalChallenge ] = useState<boolean>(false);

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
    }, [ frameRef.current ]);

    useEffect(() => {
        if (loading) return;
        if (authenticated) return;

        lockOrientation(OrientationType.PORTRAIT);
        if (!useInAppBrowser) return;

        if (!completedParentalChallenge) return;

        const cordova = (window as any).cordova;
        if (!cordova) return;

        cordova.plugins.browsertab.openUrl(`${authEndpoint}/?ua=${CUSTOM_UA}&locale=${locale.languageCode}`, (successResp: any) => { console.log(successResp); }, (failureResp: any) => {
            console.error(`no browser tab available`);
            console.error(failureResp);
        });
    }, [
        key,
        authenticated,
        loading,
        completedParentalChallenge,
    ]);

    if (!loading && !authenticated && !completedParentalChallenge) {
        return (
            <ParentalGate
                showHeader
                onCompleted={() => { setCompletedParentalChallenge(true); }} />
        );
    }

    if (useInAppBrowser) {
        return (
            <Grid
                container
                item
                direction="row"
                alignItems="center"
                style={{
                    height: `100%`,
                    padding: theme.spacing(2),
                }}
                spacing={2}>
                <LoadingWithRetry
                    messageId="auth_waiting_for_authentication"
                    retryCallback={() => setKey(Math.random().toString(36))} />
                {authenticated ? <Redirect to="/" /> : <></>}
                {process.env.NODE_ENV === `development` && (
                    <Grid
                        item
                        xs={12}
                    >
                        <DevSelectRegion />
                    </Grid>
                )}
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
