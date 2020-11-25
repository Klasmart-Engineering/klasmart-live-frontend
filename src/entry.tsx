import LogRocket from 'logrocket';
LogRocket.init('8acm62/kidsloop-live-prod', {
    mergeIframes: true,
});

import { v4 as uuid } from "uuid";
export const sessionId = uuid();

import React, { createContext, useState, useMemo, useEffect } from "react";
import * as Sentry from '@sentry/react';
import { render } from "react-dom";
import { RawIntlProvider, FormattedMessage } from "react-intl";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import {
    isMobileOnly,
    isTablet,
    isSmartTV,
    isAndroid,
    isIOS,
    isChrome,
    isFirefox,
    isSafari,
    isIE,
    isEdge,
    isChromium,
    isMobileSafari,
} from "react-device-detect";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache } from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import Alert from "@material-ui/lab/Alert";
import CloseIcon from '@material-ui/icons/Close';

import { App } from "./app";
import { createDefaultStore, State } from "./store/store";
import { setUserAgent } from "./store/reducers/session";
import { setErrCode } from "./store/reducers/communication";
import { setHistory } from "./store/reducers/location";
import { AuthTokenProvider } from "./services/auth-token/AuthTokenProvider";
import { themeProvider } from "./themeProvider";
import { getLanguage } from "./utils/locale";
import Loading from "./components/loading";
import { CameraContextProvider } from "./components/media/useCameraContext";
import useCordovaInitialize from "./cordova-initialize";
import { useAuthenticatedCheck } from "./utils/useAuthenticatedCheck";
import { Auth } from "./pages/account/auth";
import { UserInformationContextProvider } from "./context-provider/user-information-context";
import { createHashHistory } from 'history'
import { UserContextProvider } from "./context-provider/user-context";

Sentry.init({
    dsn: "https://9f4fca35be3b4b7ca970a126f26a5e54@o412774.ingest.sentry.io/5388813",
    environment: process.env.NODE_ENV || "not-specified",
});

const authToken = AuthTokenProvider.retrieveToken();
const wsLink = new WebSocketLink({
    uri: process.env.ENDPOINT_WEBSOCKET || `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/graphql`,
    options: {
        reconnect: true,
        connectionParams: {
            authToken,
            sessionId
        },
    }
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: wsLink
} as any);

const url = new URL(window.location.href)
if (url.hostname !== "localhost" && url.hostname !== "live.beta.kidsloop.net") {
    window.addEventListener("contextmenu", (e: MouseEvent) => { e.preventDefault() }, false);
}

function Entry() {
    const isCordova = navigator.userAgent.includes("Cordova");
    const dispatch = useDispatch();
    const languageCode = useSelector((state: State) => state.session.locale);
    const themeMode = useSelector((state: State) => state.control.themeMode);
    const locale = getLanguage(languageCode);

    /*
    if (!params) {
        return <RawIntlProvider value={locale}><Typography><FormattedMessage id="error_invaild_token" /></Typography></RawIntlProvider>;
    }
    */

    useEffect(() => {
        dispatch(setErrCode(null));
        dispatch(setHistory([]));
        dispatch(setUserAgent({
            isMobileOnly,
            isTablet,
            isBrowser: !isCordova,
            isSmartTV,
            isAndroid,
            isIOS,
            isChrome,
            isFirefox,
            isSafari,
            isIE,
            isEdge,
            isChromium,
            isMobileSafari,
        }));
    }, []);

    const history = createHashHistory();

    // TODO: The following effect doesn't seem to run when the location hash changes
    // instead back navigation and history stack will be tracked using the 
    // hash history object for now. This should cover the application for 
    // now because the navigations is very simple still. Later we may want
    // to have a more complication navigation graph, where state can be 
    // restored or reset appropriatly.

    /* 
    useEffect(() => {
        if (!history) return;

        const path = location.hash;

        // NOTE: This will always treat the history as a stack where each 
        // the current page will replace itself in the history stack. This
        // will prevent endless recursion where user get stuck going back 
        // between two pages. This can be improved if we manually insert
        // pages to the stack on user navigation, instead of just observing
        // the location.hash. 

        // Examples (using pushReplaceHistory):
        //   1. Page A -> Page B -> Page C (A, B, C)
        //   2. Page A -> Page B -> Page C -> Page B (A, B)
        // In first case, if user press back they will return to B page. 
        // In seconds case, if user press back they will return to A page (not C).

        // Examples (using pushHistory):
        //   1. Page A -> Page B -> Page C (A, B, C)
        //   2. Page A -> Page B -> Page C -> Page B (A, B, C, B)
        // In first case, if user press back they will return to B page. 
        // In seconds case, if user press back they will return to C page.

        console.log(`push history: ${path}`);
        dispatch(pushReplaceHistory(path));
    }, [location.hash])
    */

    const [alertMobileBrowser, setAlertMobileBrowser] = useState<boolean>(!isCordova && isMobileOnly);
    const { cordovaReady, permissions } = useCordovaInitialize(false, () => { history.goBack(); });
    const { authReady, authenticated, refresh } = useAuthenticatedCheck(cordovaReady);

    if (isCordova) {
        if (!cordovaReady) { return <Loading rawText="Loading..." /> }
        if (!permissions) { return <Loading rawText="Camera and Microphone premissions required. Please grant the permissions and restart application." /> }
        if (!authReady) { return <Loading rawText="Checking user authentication..." /> }
        if (!authenticated) { return <Auth refresh={refresh} useInAppBrowser={false} /> }
    }

    return (<>
        <UserContextProvider sessionId={sessionId}>
            <UserInformationContextProvider>
                <CameraContextProvider>
                    <RawIntlProvider value={locale}>
                        <ThemeProvider theme={themeProvider(languageCode, themeMode)}>
                            <CssBaseline />
                            <App history={history} refresh={refresh} />
                        </ThemeProvider>
                    </RawIntlProvider>
                </CameraContextProvider>
            </UserInformationContextProvider>
        </UserContextProvider>
        <Collapse in={alertMobileBrowser}>
            <Alert
                variant="filled"
                severity="warning"
                action={
                    <IconButton
                        aria-label="warning alert close"
                        color="inherit"
                        size="small"
                        onClick={() => setAlertMobileBrowser(false)}
                    >
                        <CloseIcon fontSize="inherit" />
                    </IconButton>
                }
                style={{ position: "fixed", bottom: 0, width: "100%" }}
            >
                {`Your experience might be limited on this unsupported device. For a better Kidsloop experience, please join the class on a tablet, laptop, or desktop. Thank you!`}
            </Alert>
        </Collapse>
    </>);
}

async function main() {
    const { store, persistor } = createDefaultStore();
    const renderComponent = (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ApolloProvider client={client}>
                    <Entry />
                </ApolloProvider>
            </PersistGate>
        </Provider>
    )
    render(
        renderComponent,
        document.getElementById("app")
    );
}

main();
