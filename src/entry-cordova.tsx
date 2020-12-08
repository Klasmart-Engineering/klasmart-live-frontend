import { v4 as uuid } from "uuid";
export const sessionId = uuid();

import React, { useCallback, useEffect, useState } from "react";
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
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import { App } from "./app";
import { createDefaultStore, State } from "./store/store";
import { setUserAgent } from "./store/reducers/session";
import { setErrCode } from "./store/reducers/communication";
import { setHistory } from "./store/reducers/location";
import { themeProvider } from "./themeProvider";
import { useLocaleCookie } from "./utils/locale";
import Loading from "./components/loading";
import { CameraContextProvider } from "./components/media/useCameraContext";
import useCordovaInitialize from "./cordova-initialize";
import { useAuthenticatedCheck } from "./utils/useAuthenticatedCheck";
import { Auth } from "./pages/account/auth";
import { UserInformationContextProvider } from "./context-provider/user-information-context";
import { createHashHistory } from 'history'
import { UserContextProvider } from "./context-provider/user-context";
import { useLocation } from "react-router-dom";
import { ExitDialog } from "./components/exitDialog";

function Entry() {
    const dispatch = useDispatch();
    const themeMode = useSelector((state: State) => state.control.themeMode);
    const [ language, setLanguageFromCookie ] = useLocaleCookie();
    const languageCode = useSelector((state: State) => state.session.locale);

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

    const restart = useCallback(() => {
        (navigator as any).app.loadUrl("file:///android_asset/www/index.html", { wait: 0, loadingDialog: "Wait,Loading App", loadUrlTimeoutValue: 60000 });
    }, []);

    const quit = useCallback(() => {
        (navigator as any).app.exitApp();
    }, []);

    const { cordovaReady, permissions } = useCordovaInitialize(false, () => { 
        const isRootPage = window.location.hash.includes("/schedule") || window.location.hash === "#/";
        if (window.location.hash.includes("/room")) {
            restart();
        } else if (isRootPage) {
            if (displayExitDialogue) {
                quit();
            } else {
                setDisplayExitDialogue(true);
            }
        } 
        else {
            history.goBack(); 
        }
    });
    const { authReady, authenticated, refresh } = useAuthenticatedCheck(cordovaReady);

    useEffect(() => {
        if (!authReady) return;
        setLanguageFromCookie();
    }, [authReady, setLanguageFromCookie]);

    const [displayExitDialogue, setDisplayExitDialogue] = useState<boolean>(false);

    if (!cordovaReady) { return <Loading rawText="Loading..." /> }
    if (!permissions) { return <Loading rawText="Camera and Microphone premissions required. Please grant the permissions and restart application." /> }
    if (!authReady) { return <Loading rawText="Checking user authentication..." /> }
    if (!authenticated) { return <Auth refresh={refresh} useInAppBrowser={true} /> }

    return (<>
        <UserContextProvider sessionId={sessionId}>
            <UserInformationContextProvider>
                <CameraContextProvider>
                    <RawIntlProvider value={language}>
                        <ThemeProvider theme={themeProvider(languageCode, themeMode)}>
                            <CssBaseline />
                            <App history={history} refresh={refresh} />
                            <ExitDialog visible={displayExitDialogue} onCancel={() => setDisplayExitDialogue(false)} onConfirm={() => quit()} />
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
                    <Entry />
            </PersistGate>
        </Provider>
    )
    render(
        renderComponent,
        document.getElementById("app")
    );
}

main();
