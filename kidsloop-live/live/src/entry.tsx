import React, { createContext, useState, useMemo } from "react";
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
import { LessonMaterial } from "./lessonMaterialContext";
import { AuthTokenProvider } from "./services/auth-token/AuthTokenProvider";
import { getLanguage } from "./utils/locale";

// It's a temporary that sending a locale value as a url parameter.
const languageCode = new URL(window.location.href).searchParams.get("lang") || "en";
const locale = getLanguage(languageCode);

function setTypography(languageCode: string) {
    let localeFontFamily = "CircularStd";
    const localeWeightLight = 400;
    const localeWeightMedium = 600;
    let localeWeightRegular = 400;
    const localeWeightBold = 700;

    switch (languageCode) {
        case "en":
            localeFontFamily = "CircularStd";
            break;
        case "ko":
            localeFontFamily = "NanumSquareRound";
            localeWeightRegular = 600;
            break;
        case "zh-CN":
            localeFontFamily = "Source Han Sans SC";
            break;
        default:
            break;
    }
    localeFontFamily = [localeFontFamily, "-apple-system", "Segoe UI", "Helvetica", "sans-serif"].join(",");
    return { localeFontFamily, localeWeightLight, localeWeightMedium, localeWeightRegular, localeWeightBold };
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

const palette: PaletteOptions = {
    primary: {
        contrastText: "#fff",
        dark: "#1896ea",
        light: "#0E78D5",
        main: "#0E78D5",
    },
};

const localeTypography = setTypography("en");
const typography = {
    button: {
        textTransform: "none",
    },
    fontFamily: localeTypography.localeFontFamily,
    fontWeightBold: localeTypography.localeWeightBold,
    fontWeightLight: localeTypography.localeWeightLight,
    fontWeightMedium: localeTypography.localeWeightMedium,
    fontWeightRegular: localeTypography.localeWeightRegular,
} as any;

let theme: Theme;
palette.type = "light";
palette.background = { default: "white" };
theme = createMuiTheme({ palette, typography });
theme = responsiveFontSizes(theme);


export interface IUserContext {
    teacher: boolean,
    materials: LessonMaterial[]
    roomId: string,
    sessionId: string,
    name?: string,
    setName: React.Dispatch<React.SetStateAction<string | undefined>>
}

export const UserContext = createContext<IUserContext>({ setName: () => null, roomId: "", materials: [], teacher: false } as any as IUserContext);

function parseToken() {
    try {
        const url = new URL(window.location.href);
        if (url.hostname === "localhost" || url.hostname === "live.kidsloop.net") {
            const materialsParam = url.searchParams.get("materials");
            return {
                teacher: url.searchParams.get("teacher") !== null,
                name: url.searchParams.get("name") || undefined, // Should be undefined not null
                roomId: url.searchParams.get("roomId") || "test-room",
                materials: materialsParam ? JSON.parse(materialsParam) : [
                    { name: "Pairs", url: "/h5p/play/5ecf4e4b611e18398f7380ef" },
                    { name: "Video", video: "./video.mp4" },
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
    const userContext = useMemo<IUserContext>(() => ({
        name,
        setName,
        sessionId,
        roomId: params.roomId,
        teacher: params.teacher,
        materials: params.materials
    }), [name, setName, params]);
    const webRTCContextValue = WebRTCContext.useWebRTCContext(sessionId, userContext.roomId);

    return (
        <HashRouter>
            <UserContext.Provider value={userContext}>
                <webRTCContext.Provider value={webRTCContextValue}>
                    <ScreenShare.Provider>
                        <RawIntlProvider value={locale}>
                            <ThemeProvider theme={theme}>
                                <CssBaseline />
                                <App />
                            </ThemeProvider>
                        </RawIntlProvider>
                    </ScreenShare.Provider>
                </webRTCContext.Provider>
            </UserContext.Provider>
        </HashRouter>
    );
}

render(
    <ApolloProvider client={client}>
        <Entry />
    </ApolloProvider>,
    document.getElementById("app")
);
