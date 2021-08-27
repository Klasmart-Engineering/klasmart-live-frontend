import { themeProvider } from "../../themeProvider";
import { CompositionRoot } from "../context-provider/composition-root";
import { CordovaSystemProvider } from "../context-provider/cordova-system-context";
import { PopupProvider } from "../context-provider/popup-context";
import { App } from "../cordova-app";
import { useLocaleCookie } from "../utils/localeCookie";
import { setErrCode } from "./store/reducers/communication";
import { setHistory } from "./store/reducers/location";
import { setUserAgent } from "./store/reducers/session";
import {
    createDefaultStore,
    State,
} from "./store/store";
import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import { createHashHistory } from 'history';
import { SnackbarProvider } from "kidsloop-px";
import React,
{ useEffect } from "react";
import {
    isAndroid,
    isChrome,
    isChromium,
    isEdge,
    isFirefox,
    isIE,
    isIOS,
    isMobileOnly,
    isMobileSafari,
    isSafari,
    isSmartTV,
    isTablet,
} from "react-device-detect";
import { render } from "react-dom";
import { RawIntlProvider } from "react-intl";
import {
    Provider,
    useDispatch,
    useSelector,
} from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { v4 as uuid } from "uuid";

export const sessionId = uuid();

function Entry () {
    const dispatch = useDispatch();
    const themeMode = useSelector((state: State) => state.control.themeMode);
    const [ language ] = useLocaleCookie();
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

    return (
        <RawIntlProvider value={language}>
            <CordovaSystemProvider history={history}>
                <CompositionRoot sessionId={sessionId}>
                    <ThemeProvider theme={themeProvider(languageCode, themeMode)}>
                        <SnackbarProvider >
                            <CssBaseline />
                            <PopupProvider>
                                <App history={history} />
                            </PopupProvider>
                        </SnackbarProvider>
                    </ThemeProvider>
                </CompositionRoot>
            </CordovaSystemProvider>
        </RawIntlProvider >
    );
}

async function main () {
    const { store, persistor } = createDefaultStore();
    const renderComponent = (
        <Provider store={store}>
            <PersistGate
                loading={null}
                persistor={persistor}>
                <Entry />
            </PersistGate>
        </Provider>
    );
    render(renderComponent, document.getElementById(`app`));
}

main();
