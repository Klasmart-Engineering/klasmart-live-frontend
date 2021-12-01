import { useHttpEndpoint } from "../../../providers/region-select-context";
import LoadingWithRetry from "../../components/loadingWithRetry";
import { useAuthenticationContext } from "../../context-provider/authentication-context";
import { ParentalGate } from "../../dialogs/parentalGate";
import {
    localeState,
    OrientationType,
    selectedRegionState,
} from "../../model/appModel";
import { lockOrientation } from "../../utils/screenUtils";
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import {
    Button,
    Grid,
} from "@material-ui/core";
import createStyles from "@material-ui/core/styles/createStyles";
import makeStyles from "@material-ui/core/styles/makeStyles";
import React,
{
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { Redirect } from "react-router-dom";
import {
    useRecoilState,
    useRecoilValue,
} from "recoil";

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
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [ key, setKey ] = useState(Math.random().toString(36));
    const locale = useRecoilValue(localeState);

    const [ selectedRegion, setSelectedRegion ] = useRecoilState(selectedRegionState);

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

    const { restart } = useCordovaSystemContext();

    const selectRegionWithId = useCallback((regionId: string) => {
        setSelectedRegion({
            ...selectedRegion,
            regionId,
        });

        if (restart) {
            restart();
        }
    }, [ selectedRegion, restart ]);

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
                    height: `100%`,
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
                        style={{
                            textAlign: `center`,
                        }}
                    >
                        <Button onClick={() => { selectRegionWithId(`auth.alpha.kidsloop.net`); }}><FormattedMessage id={`select_region_alpha`} /></Button>
                        <Button onClick={() => { selectRegionWithId(`auth.stage.kidsloop.live`); }}><FormattedMessage id={`select_region_staging`} /></Button>
                        <Button onClick={() => { selectRegionWithId(`auth.kidsloop.live`); }}><FormattedMessage id={`select_region_production`} /></Button>
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
