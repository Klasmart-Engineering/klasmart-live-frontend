import LogRocket from 'logrocket';
LogRocket.init('8acm62/kidsloop-live-prod', {
    mergeIframes: true,
});

import { v4 as uuid } from "uuid";
export const sessionId = uuid();

import React, { createContext, useState, useMemo, useEffect } from "react";
import { Provider, useDispatch } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as Sentry from '@sentry/react';
import { render } from "react-dom";
import { RawIntlProvider, FormattedMessage } from "react-intl";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache } from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";
import jwt_decode from "jwt-decode";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
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
    isMacOs,
    isIOS13
} from "react-device-detect";
import { App } from "./app";
import { createDefaultStore } from "./store/store";
import { LessonMaterial, MaterialTypename } from "./lessonMaterialContext";
import { AuthTokenProvider } from "./services/auth-token/AuthTokenProvider";
import { themeProvider } from "./themeProvider";
import { getLanguage, getDefaultLanguageCode } from "./utils/locale";
import { setUserAgent } from "./store/reducers/session";

import ChromeLogo from "./assets/img/browser/chrome_logo.svg";
import SafariLogo from "./assets/img/browser/safari_logo.png";

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

export interface IThemeContext {
    themeMode: string,
    languageCode: string,
    setThemeMode: React.Dispatch<React.SetStateAction<string>>
    setLanguageCode: React.Dispatch<React.SetStateAction<string>>
}

export interface ILocalSessionContext {
    classtype: string, // "live" | "class" | "study" | "task"
    org_id: string,
    isTeacher: boolean,
    materials: LessonMaterial[],
    roomId: string,
    sessionId: string,
    name?: string,
    setName: React.Dispatch<React.SetStateAction<string | undefined>>
    camera?: MediaStream | null,
    setCamera: React.Dispatch<React.SetStateAction<MediaStream | undefined | null>>,
}

export const ThemeContext = createContext<IThemeContext>({ themeMode: "", setThemeMode: () => null, languageCode: "", setLanguageCode: () => null } as any as IThemeContext);
export const LocalSessionContext = createContext<ILocalSessionContext>({ setName: () => null, roomId: "", materials: [], isTeacher: false } as any as ILocalSessionContext);

const url = new URL(window.location.href)
if (url.hostname !== "localhost" && url.hostname !== "live.beta.kidsloop.net") {
    window.addEventListener("contextmenu", (e: MouseEvent) => { e.preventDefault() }, false);
}

function parseToken() {
    try {
        // TODO think of a better way to set up the debug environment
        const isDebugMode = url.hostname === "localhost" || url.hostname === "0.0.0.0";
        if (isDebugMode) {
            const materialsParam = url.searchParams.get("materials");
            return {
                classtype: url.searchParams.get("classtype") || "live",
                org_id: url.searchParams.get("org_id") || "",
                teacher: url.searchParams.get("teacher") !== null,
                name: url.searchParams.get("name") || undefined, // Should be undefined not null
                roomId: url.searchParams.get("roomId") || "test-room",
                materials: materialsParam ? JSON.parse(materialsParam) : [
                    { __typename: MaterialTypename.Iframe, name: "Pairs", url: "/h5p/play/5ecf4e4b611e18398f7380ef" },
                    { __typename: MaterialTypename.Iframe, name: "Flashcards", url: "/h5p/play/5ed05dd1611e18398f7380f4" },
                    { __typename: MaterialTypename.Iframe, name: "Drag and Drop", url: "/h5p/play/5ed0b64a611e18398f7380fb" },
                    { __typename: MaterialTypename.Iframe, name: "Hot Spot 1", url: "/h5p/play/5ecf6f43611e18398f7380f0" },
                    { __typename: MaterialTypename.Iframe, name: "Hot Spot 2", url: "/h5p/play/5ed0a79d611e18398f7380f7" },
                    { __typename: MaterialTypename.Video, name: "Video", url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || "."}/test_video.mp4` },
                    { __typename: MaterialTypename.Audio, name: "Audio", url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || "."}/test_audio.m4a` },
                    { __typename: MaterialTypename.Image, name: "Portrait Image", url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || "."}/test_image_portrait.jpg` },
                    { __typename: MaterialTypename.Image, name: "Landscape Image", url: `${process.env.ENDPOINT_TEST_ASSETS_S3 || "."}/test_image_landscape.jpg` },
                    { name: "Pairs - Legacy", url: `/h5p/play/5ecf4e4b611e18398f7380ef` },
                    { name: "Video - Legacy", video: `${process.env.ENDPOINT_TEST_ASSETS_S3 || "."}/test_video.mp4` },
                ],
            };
        }

        const token = url.searchParams.get("token");
        if (token) {
            const payload = jwt_decode(token) as any;
            const materials = payload.materials ? payload.materials : []
            const parsedMaterials = materials.map((mat: any) => {
                if (mat.__typename === "Iframe") {
                    return { __typename: MaterialTypename.Iframe, name: mat.name, url: mat.url };
                } else if (mat.__typename === "Video") {
                    return { __typename: MaterialTypename.Video, name: mat.name, url: mat.url };
                } else if (mat.__typename === "Audio") {
                    return { __typename: MaterialTypename.Audio, name: mat.name, url: mat.url };
                } else if (mat.__typename === "Image") {
                    return { __typename: MaterialTypename.Image, name: mat.name, url: mat.url };
                }
            });
            return {
                classtype: payload.classtype ? String(payload.classtype) : "live",
                org_id: payload.org_id ? String(payload.org_id) : "",
                isTeacher: payload.teacher ? Boolean(payload.teacher) : false,
                name: payload.name ? String(payload.name) : undefined,
                roomId: String(payload.roomid),
                materials: parsedMaterials || [],
            };
        }
    } catch (e) { }
    return;
}
const params = parseToken();
if (params && params.name) {
    LogRocket.identify(params.name, { sessionId })
}
function Entry() {
    const [camera, setCamera] = useState<MediaStream | null>();
    const [name, setName] = useState(params ? params.name : "");
    const [languageCode, setLanguageCode] = useState(url.searchParams.get("lang") || getDefaultLanguageCode());
    const [themeMode, setThemeMode] = useState(url.searchParams.get("theme") || "light");
    const locale = getLanguage(languageCode);

    const themeContext = useMemo<IThemeContext>(() => ({
        themeMode,
        setThemeMode,
        languageCode,
        setLanguageCode,
    }), [themeMode, setThemeMode, languageCode, setLanguageCode]);

    const localSession = useMemo<ILocalSessionContext>(() => ({
        classtype: params ? params.classtype : "live",
        org_id: params ? params.org_id : "",
        camera,
        setCamera,
        name,
        setName,
        sessionId,
        roomId: params ? params.roomId : "",
        isTeacher: params && params.isTeacher ? params.isTeacher : false,
        materials: params ? params.materials : null
    }), [camera, setCamera, name, setName, params]);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setUserAgent({
            isMobileOnly,
            isTablet,
            isBrowser: true,
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

    return (
        <ThemeContext.Provider value={themeContext}>
            <LocalSessionContext.Provider value={localSession}>
                <RawIntlProvider value={locale}>
                    <ThemeProvider theme={themeProvider(languageCode, themeMode)}>
                        <CssBaseline />
                        {!params ? <Typography><FormattedMessage id="error_invaild_token" /></Typography> : <App />}
                    </ThemeProvider>
                </RawIntlProvider>
            </LocalSessionContext.Provider>
        </ThemeContext.Provider>
    );
}

let renderComponent: JSX.Element;
if (
    isMacOs && (isSafari || isChrome) // Support Safari and Chrome in MacOS
    || (isIOS || isIOS13) && isSafari // Support only Safari in iOS
    || (!isIOS || !isIOS13) && isChrome // Support only Chrome in other OS
) {
    const { store, persistor } = createDefaultStore();
    renderComponent = (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <ApolloProvider client={client}>
                    <Entry />
                </ApolloProvider>
            </PersistGate>
        </Provider>
    )
} else {
    renderComponent = <BrowserGuide />
}
render(
    renderComponent,
    document.getElementById("app")
);

function BrowserGuide() {
    return (
        <Grid
            container
            justify="center"
            alignItems="center"
            style={{
                display: "flex",
                flexGrow: 1,
                height: "100vh"
            }}
        >
            <GuideContent />
        </Grid>
    )
}

function GuideContent() {
    // const browserName = iOS ? "Safari" : "Chrome";
    const apple = isMacOs || isIOS || isIOS13;
    const [languageCode, _] = useState(url.searchParams.get("lang") || getDefaultLanguageCode());
    const locale = getLanguage(languageCode);
    return (
        <RawIntlProvider value={locale}>
            <Grid
                container
                direction="column"
                alignItems="center"
                alignContent="center"
                spacing={1}
            >
                <Grid item>
                    <img src={apple ? SafariLogo : ChromeLogo} height={80} />
                </Grid>
                <Grid item>
                    <Typography variant="subtitle1">
                        {apple ? (isMacOs ?
                            <FormattedMessage id="browser_guide_title_macos" /> :
                            <FormattedMessage id="browser_guide_title_ios" />
                        ) : <FormattedMessage id="browser_guide_title" />}
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle2">
                        <FormattedMessage id="browser_guide_body" />
                    </Typography>
                </Grid>
            </Grid>
        </RawIntlProvider>
    )
}