import { themeProvider } from "../../themeProvider";
import { CompositionRoot } from "../context-provider/composition-root";
import { CordovaSystemProvider } from "../context-provider/cordova-system-context";
import { PopupProvider } from "../context-provider/popup-context";
import { App } from "../cordova-app";
import {
    errorState,
    historyState,
    localeState,
} from "../model/appModel";
import { useLocaleCookie } from "../utils/localeCookie";
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
import { useRecoilState } from "recoil";
import { PersistGate } from "redux-persist/integration/react";
import { setUserAgent } from "src/store/reducers/session";
import {
    createDefaultStore,
    State,
} from "src/store/store";
import { v4 as uuid } from "uuid";

export const sessionId = uuid();

function Entry () {
    const dispatch = useDispatch();
    const themeMode = useSelector((state: State) => state.control.themeMode);
    const [ language ] = useLocaleCookie();

    const [ locale ] = useRecoilState(localeState);
    const [ , setError ] = useRecoilState(errorState);
    const [ , setHistory ] = useRecoilState(historyState);

    useEffect(() => {
        setError({
            isError: false,
            errorCode: null,
        });

        // TODO: Is this history state necessary?
        setHistory([]);

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
                    <ThemeProvider theme={themeProvider(locale.languageCode, themeMode)}>
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
