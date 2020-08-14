import React, { createContext, useState, useMemo, useEffect } from "react";
import * as Sentry from '@sentry/react';
import { render } from "react-dom";
import { HashRouter } from "react-router-dom";
import { RawIntlProvider, FormattedMessage } from "react-intl";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient, InMemoryCache } from "apollo-boost";
import { WebSocketLink } from "apollo-link-ws";
import jwt_decode from "jwt-decode";
import { v4 as uuid } from "uuid";
import { createMuiTheme, responsiveFontSizes, Theme, ThemeProvider } from "@material-ui/core/styles";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { App } from "./app";
import { webRTCContext, WebRTCContext } from "./webRTCState";
import { ScreenShare } from "./pages/teacher/screenShareProvider";
import { LessonMaterial, MaterialTypename } from "./lessonMaterialContext";
import { AuthTokenProvider } from "./services/auth-token/AuthTokenProvider";
import { getLanguage } from "./utils/locale";

import testAudio from "./assets/audio/test_audio.m4a";
import testImageLandscape from "./assets/img/test_image_landsape.jpg";
import testImagePortrait from "./assets/img/test_image_portrait.jpg";
import testVideo from "./assets/img/test_video.mp4";
import { themeProvider } from "./themeProvider";

Sentry.init({
    dsn: "https://9f4fca35be3b4b7ca970a126f26a5e54@o412774.ingest.sentry.io/5388813",
    environment: process.env.NODE_ENV || "not-specified",
    release: 'kidsloop-live@' + process.env.npm_package_version,
});

const url = new URL(window.location.href)

// It's a temporary that sending a ui value as a url parameter.
// Later we may be able to send the hub UI's redux value like <Live lang={lang} theme={theme} />
function getDefaultLanguageCode() {
    const localeCodes = ["en", "ko"]
    const languages = navigator.languages || [
        (navigator as any).language,
        (navigator as any).browerLanguage,
        (navigator as any).userLanguage,
        (navigator as any).systemLanguage,
    ];
    for (const language of languages) {
        if (localeCodes.indexOf(language) !== -1) {
            return language;
        }
    }
    return "en";
}

export const sessionId = uuid();

const authToken = AuthTokenProvider.retrieveToken();
const wsLink = new WebSocketLink({
    uri: `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/graphql`,
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

export interface IUserContext {
    teacher: boolean,
    materials: LessonMaterial[]
    roomId: string,
    sessionId: string,
    name?: string,
    setName: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const ThemeContext = createContext<IThemeContext>({ themeMode: "", setThemeMode: () => null, languageCode: "", setLanguageCode: () => null } as any as IThemeContext);
export const UserContext = createContext<IUserContext>({ setName: () => null, roomId: "", materials: [], teacher: false } as any as IUserContext);

function parseToken() {
    try {
        if (url.hostname === "localhost" || url.hostname === "live.kidsloop.net") {
            const materialsParam = url.searchParams.get("materials");
            return {
                teacher: url.searchParams.get("teacher") !== null,
                name: url.searchParams.get("name") || undefined, // Should be undefined not null
                roomId: url.searchParams.get("roomId") || "test-room",
                materials: materialsParam ? JSON.parse(materialsParam) : [
                    { __typename: MaterialTypename.Iframe, name: "Pairs", url: "/h5p/play/5ecf4e4b611e18398f7380ef" },
                    { __typename: MaterialTypename.Iframe, name: "Flashcards", url: "/h5p/play/5ed05dd1611e18398f7380f4" },
                    { __typename: MaterialTypename.Video, name: "Video", url: "./test_video.mp4" },
                    { __typename: MaterialTypename.Audio, name: "Audio", url: "./test_audio.m4a" },
                    { __typename: MaterialTypename.Image, name: "Portrait Image", url: "./test_image_portrait.jpg" },
                    { __typename: MaterialTypename.Image, name: "Landscape Image", url: "./test_image_landscape.jpg" },
                    { name: "Pairs - Legacy", url: "/h5p/play/5ecf4e4b611e18398f7380ef" },
                    { name: "Video - Legacy", video: "./test_video.mp4" },
                ],
            };
        }

        const token = url.searchParams.get("token");
        if (!token) { return; }
        const payload = jwt_decode(token) as any;
        return {
            teacher: payload.teacher ? Boolean(payload.teacher) : false,
            name: payload.name ? String(payload.name) : undefined,
            roomId: String(payload.roomid),
            materials: payload.materials || [],
        };
        // eslint-disable-next-line no-empty
    } catch (e) { }
    return;
}
const params = parseToken();
function Entry() {
    if (!params) { return <Typography><FormattedMessage id="error_invaild_token" /></Typography>; }
    const [name, setName] = useState(params.name);
    const [languageCode, setLanguageCode] = useState(url.searchParams.get("lang") || getDefaultLanguageCode());
    const [themeMode, setThemeMode] = useState(url.searchParams.get("theme") || "light");
    const locale = getLanguage(languageCode);

    const themeContext = useMemo<IThemeContext>(() => ({
        themeMode,
        setThemeMode,
        languageCode,
        setLanguageCode,
    }), [themeMode, setThemeMode, languageCode, setLanguageCode]);

    const userContext = useMemo<IUserContext>(() => ({
        name,
        setName,
        sessionId,
        roomId: params.roomId,
        teacher: params.teacher,
        materials: params.materials
    }), [name, setName, params]);
    const webRTCContextValue = WebRTCContext.useWebRTCContext(sessionId, userContext.roomId);

    useEffect(() => {
        // IP Protection
        const blockRightClick = (e: MouseEvent) => { e.preventDefault() }
        window.addEventListener("contextmenu", (e) => blockRightClick(e), false);
        return window.removeEventListener("contextmenu", (e) => blockRightClick(e), false);
    }, [])

    return (
        <HashRouter>
            <ThemeContext.Provider value={themeContext}>
                <UserContext.Provider value={userContext}>
                    <webRTCContext.Provider value={webRTCContextValue}>
                        <ScreenShare.Provider>
                            <RawIntlProvider value={locale}>
                                <ThemeProvider theme={themeProvider(languageCode, themeMode)}>
                                    <CssBaseline />
                                    <App />
                                </ThemeProvider>
                            </RawIntlProvider>
                        </ScreenShare.Provider>
                    </webRTCContext.Provider>
                </UserContext.Provider>
            </ThemeContext.Provider>
        </HashRouter>
    );
}

render(
    <ApolloProvider client={client}>
        <Entry />
    </ApolloProvider>,
    document.getElementById("app")
);
