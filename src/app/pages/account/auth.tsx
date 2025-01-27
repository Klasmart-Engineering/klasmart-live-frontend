import { useHttpEndpoint } from "../../../providers/region-select-context";
import { DevSelectRegion } from "../../components/auth/devSelectRegion";
import LoadingWithRetry from "../../components/loadingWithRetry";
import { useAuthenticationContext } from "../../context-provider/authentication-context";
import {
    isShowOnBoardingState,
    localeState,
} from "../../model/appModel";
import {
    useSelectedOrganizationValue,
    useSelectedUserValue,
} from "@/app/data/user/atom";
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

const CORDOVA = `cordova`;

const CUSTOM_UA = process.env.CUSTOM_UA || CORDOVA;

const BASE_36 = 36;

interface Props {
    useInAppBrowser: boolean;
}

export function Auth ({ useInAppBrowser }: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const frameRef = useRef<HTMLIFrameElement>(null);
    const selectedUser = useSelectedUserValue();
    const selectedOrganization = useSelectedOrganizationValue();
    const [ key, setKey ] = useState(Math.random()
        .toString(BASE_36));
    const locale = useRecoilValue(localeState);

    const authEndpoint = useHttpEndpoint(`auth`);
    const [ isShowOnBoarding, setIsShowOnBoarding ] = useRecoilState(isShowOnBoardingState);

    const {
        loading,
        authenticated,
        actions,
    } = useAuthenticationContext();

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
        if (!useInAppBrowser) return;
        if (isShowOnBoarding) return;

        const cordova = (window as any).cordova;
        if (!cordova) return;

        cordova.plugins.browsertab.openUrl(`${authEndpoint}/?ua=${CUSTOM_UA}&locale=${locale.languageCode}`, (successResp: any) => { console.log(successResp); }, (failureResp: any) => {
            console.error(`no browser tab available`);
            console.error(failureResp);
        });

        if (process.env.NODE_ENV === `production`) {
            setTimeout(() => setIsShowOnBoarding(true), 500);
        }
    }, [
        key,
        authenticated,
        loading,
        isShowOnBoarding,
    ]);

    if (loading) return null;

    if (!loading && !authenticated && isShowOnBoarding) {
        return (<Redirect to="/on-boarding" />);
    }

    if (authenticated && (!selectedUser || !selectedOrganization)) {
        return (<Redirect to="/select-user-role" />);
    }

    if (authenticated) {
        return (<Redirect to="/" />);
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
                spacing={2}
            >
                <LoadingWithRetry
                    messageId="auth_waiting_for_authentication"
                    retryCallback={() => setKey(Math.random()
                        .toString(BASE_36))}
                />
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
                    src={authEndpoint}
                />
            </div>
        );
    }
}
