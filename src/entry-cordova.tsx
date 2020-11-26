import { v4 as uuid } from "uuid";
export const sessionId = uuid();

import React, { createContext, useEffect } from "react";
import { render } from "react-dom";
import { RawIntlProvider } from "react-intl";
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

import { App } from "./app";
import { createDefaultStore, State } from "./store/store";
import { setUserAgent } from "./store/reducers/session";
import { setErrCode } from "./store/reducers/communication";
import { setHistory } from "./store/reducers/location";
import { AuthTokenProvider } from "./services/auth-token/AuthTokenProvider";
import { themeProvider } from "./themeProvider";
import { getLanguage, useLocaleLanguage } from "./utils/locale";
import Loading from "./components/loading";
import { CameraContextProvider } from "./components/media/useCameraContext";
import useCordovaInitialize from "./cordova-initialize";
import { useAuthenticatedCheck } from "./utils/useAuthenticatedCheck";
import { Auth } from "./pages/account/auth";
import { UserInformationContextProvider } from "./context-provider/user-information-context";
import { createHashHistory } from 'history'
import { UserContextProvider } from "./context-provider/user-context";

// TODO: This code was written using the assumption page would always reload
// after the token had been set. Since we schedule pick and join button the
// token required here might not be set before page was loaded, instead it 
// would be set when user pick a class to join. This is different from how
// the live website works since token is always set before user enter the 
// live website.
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

function Entry() {
    const dispatch = useDispatch();
    const themeMode = useSelector((state: State) => state.control.themeMode);
    const { language, languageCode, languageFromCookieLocale } = useLocaleLanguage();

    useEffect(() => {
        dispatch(setErrCode(null));
        dispatch(setHistory([]));
        dispatch(setUserAgent({
            isMobileOnly,
            isTablet,
            isBrowser: false, // NOTE: Used to be !isCordova. This entry will be used in *only* cordova builds.
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

    const { cordovaReady, permissions } = useCordovaInitialize(false, () => { history.goBack(); });
    const { authReady, authenticated, refresh } = useAuthenticatedCheck(cordovaReady);

    useEffect(() => {
        if (!authReady) return;
        languageFromCookieLocale();
    }, [authReady, languageFromCookieLocale]);

    if (!cordovaReady) { return <Loading rawText="Loading..." /> }
    if (!permissions) { return <Loading rawText="Camera and Microphone premissions required. Please grant the permissions and restart application." /> }
    if (!authReady) { return <Loading rawText="Checking user authentication..." /> }
    if (!authenticated) { return <Auth refresh={refresh} useInAppBrowser={false} /> }

    return (<>
        <UserContextProvider sessionId={sessionId}>
            <UserInformationContextProvider>
                <CameraContextProvider>
                    <RawIntlProvider value={language}>
                        <ThemeProvider theme={themeProvider(languageCode, themeMode)}>
                            <CssBaseline />
                            <App history={history} refresh={refresh} />
                        </ThemeProvider>
                    </RawIntlProvider>
                </CameraContextProvider>
            </UserInformationContextProvider>
        </UserContextProvider>
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
