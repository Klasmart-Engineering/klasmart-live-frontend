import { v4 as uuid } from "uuid";
export const sessionId = uuid();

import React, { useEffect } from "react";
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
import { createHashHistory } from 'history'
import { CordovaSystemProvider } from "./context-provider/cordova-system-context";
import { CompositionRoot } from "./context-provider/composition-root";
import { setSchedule } from "./store/reducers/data";

function Entry() {
    const dispatch = useDispatch();
    const themeMode = useSelector((state: State) => state.control.themeMode);
    const [language] = useLocaleCookie();
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
        dispatch(setSchedule({ total: [], live: [], study: [] }));
    }, []);

    const history = createHashHistory();

    return (
        <CordovaSystemProvider history={history}>
            <CompositionRoot sessionId={sessionId}>
                <RawIntlProvider value={language}>
                    <ThemeProvider theme={themeProvider(languageCode, themeMode)}>
                        <CssBaseline />
                        <App history={history} />
                    </ThemeProvider>
                </RawIntlProvider>
            </CompositionRoot>
        </CordovaSystemProvider>
    );
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
