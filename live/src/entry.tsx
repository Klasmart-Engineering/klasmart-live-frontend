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

const url = new URL(window.location.href)

/************
 * UI START *
 ************/
// It's a temporary that sending a ui value as a url parameter.
// Later we may be able to send the hub UI's redux value like <Live lang={lang} theme={theme} />
const languageCode = url.searchParams.get("lang") || "en";
const themeMode = url.searchParams.get("theme") || "light";
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

const overrides = {
    MuiAppBar: {
        root: {
            backgroundColor: themeMode === "light" ? "#fafafa" : "#041125",
        },
    },
    MuiTable: {
        root: {
            backgroundColor: themeMode === "light" ? "#fff" : "#05152e",
        },
    },
    MuiTableCell: {
        stickyHeader: {
            backgroundColor: themeMode === "light" ? "#fafafa" : "#041125",
        },
    },
    MuiTab: {
        root: {
            backgroundColor: themeMode === "light" ? "#fafafa" : "#041125 !important",
        },
    },
    MuiIconButton: {
        colorPrimary: {
            color: themeMode === "light" ? "#0E78D5" : "#fafafa !important", // TODO: Confirm color
            backgroundColor: themeMode === "light" ? "#f6fafe" : "#0E78D5 !important", // TODO: Confirm color
        },
    },
    MuiInputBase: {
        input: {
            color: themeMode === "light" ? "#0E78D5" : "#1896ea", // TODO: Confirm color
        },
    },
    MuiToggleButton: {
        root: {
            color: themeMode === "light" ? "#fafafa" : "#0E78D5", // TODO: Confirm color
        },
    }
};

const palette: PaletteOptions = {
    background: {
        default: themeMode === "light" ? "#fafafa" : "#030D1C",
        paper: themeMode === "light" ? "#fff" : "#030D1C",
    },
    primary: {
        contrastText: "#fff",
        dark: "#1896ea",
        light: "#0E78D5",
        main: "#0E78D5",
    },
};

let theme: Theme;
if (themeMode === "light") {
    palette.type = "light";
    palette.background = { default: "white" };
    theme = createMuiTheme({ overrides, palette, typography });
} else {
    palette.type = "dark";
    theme = createMuiTheme({ overrides, palette, typography });
}
theme = responsiveFontSizes(theme);
/**********
 * UI END *
 **********/

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
