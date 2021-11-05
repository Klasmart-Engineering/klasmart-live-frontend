import { setUserAgent } from "../../store/reducers/session";
import {
    createDefaultStore,
    State,
} from "../../store/store";
import { themeProvider } from "../../themeProvider";
import { CompositionRoot } from "../context-provider/composition-root";
import { CordovaSystemProvider } from "../context-provider/cordova-system-context";
import { PopupProvider } from "../context-provider/popup-context";
import { App } from "../cordova-app";
import { UserServiceApolloClient } from "../data/user/userServiceApolloClient";
import {
    errorState,
    historyState,
    localeState,
} from "../model/appModel";
import { useLocaleCookie } from "../utils/localeCookie";
import { getIntl } from "@/app/localization/localeCodes";
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
import {
    RecoilRoot,
    useRecoilState,
} from "recoil";
import { PersistGate } from "redux-persist/integration/react";
import { v4 as uuid } from "uuid";

export const sessionId = uuid();

function Entry () {
    const dispatch = useDispatch();
    const themeMode = useSelector((state: State) => state.control.themeMode);

    /* TODO (Gael): I don't know what this things does
    const [ language ] = useLocaleCookie();
    */

    const [ locale ] = useRecoilState(localeState);
    const [ , setError ] = useRecoilState(errorState);
    const [ , setHistory ] = useRecoilState(historyState);

    const language = getIntl(locale.languageCode);

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
                    <UserServiceApolloClient>
                        <ThemeProvider theme={themeProvider(locale.languageCode, themeMode)}>
                            <SnackbarProvider>
                                <CssBaseline />
                                <PopupProvider>
                                    <App history={history} />
                                </PopupProvider>
                            </SnackbarProvider>
                        </ThemeProvider>
                    </UserServiceApolloClient>
                </CompositionRoot>
            </CordovaSystemProvider>
        </RawIntlProvider>
    );
}

function main () {
    const { store, persistor } = createDefaultStore();
    const renderComponent = (
        <Provider store={store}>
            <PersistGate
                loading={null}
                persistor={persistor}>
                <RecoilRoot>
                    <Entry />
                </RecoilRoot>
            </PersistGate>
        </Provider>
    );
    render(renderComponent, document.getElementById(`app`));
}

main();
