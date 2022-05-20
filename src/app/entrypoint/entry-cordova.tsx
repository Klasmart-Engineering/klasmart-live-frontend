import CmsApiClientProvider from "@/app/context-provider/CmsApiClientProvider";
import { CompositionRoot } from "@/app/context-provider/composition-root";
import { CordovaSystemProvider } from "@/app/context-provider/cordova-system-context";
import { PopupProvider } from "@/app/context-provider/popup-context";
import { CordovaApp } from "@/app/cordova-app";
import { UserServiceApolloClient } from "@/app/data/user/userServiceApolloClient";
import { getIntl } from "@/app/localization/localeCodes";
import {
    errorState,
    historyState,
    localeState,
} from "@/app/model/appModel";
import { setUserAgent } from "@/store/reducers/session";
import {
    createDefaultStore,
    State,
} from "@/store/store";
import { themeProvider } from "@/themeProvider";
import { ReactQueryDevtools } from "@kl-engineering/cms-api-client";
import { SnackbarProvider } from "@kl-engineering/kidsloop-px";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, Theme, StyledEngineProvider } from "@mui/material";
import { createHashHistory } from 'history';
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



declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}



declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


export const sessionId = uuid();

function Entry () {
    const dispatch = useDispatch();
    const themeMode = useSelector((state: State) => state.control.themeMode);

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
                    <CmsApiClientProvider>
                        <UserServiceApolloClient>
                            <StyledEngineProvider injectFirst>
                                <ThemeProvider theme={themeProvider(locale.languageCode, themeMode)}>
                                    <SnackbarProvider >
                                        <CssBaseline />
                                        <PopupProvider>
                                            <CordovaApp history={history} />
                                        </PopupProvider>
                                    </SnackbarProvider>
                                </ThemeProvider>
                            </StyledEngineProvider>
                        </UserServiceApolloClient>
                        {process.env.NODE_ENV === `development` && <ReactQueryDevtools />}
                    </CmsApiClientProvider>
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
                persistor={persistor}
            >
                <RecoilRoot>
                    <Entry />
                </RecoilRoot>
            </PersistGate>
        </Provider>
    );
    render(renderComponent, document.getElementById(`app`));
}

main();
