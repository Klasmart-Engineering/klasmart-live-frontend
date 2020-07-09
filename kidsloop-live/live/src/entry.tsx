import React, { createContext } from 'react'
import { render } from 'react-dom'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient, InMemoryCache } from 'apollo-boost'
import { WebSocketLink } from 'apollo-link-ws'
import { AuthTokenProvider } from './services/auth-token/AuthTokenProvider'
import { App } from './app'
import { HashRouter } from "react-router-dom";
import { v4 as uuid } from "uuid";
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, responsiveFontSizes, Theme, ThemeProvider } from "@material-ui/core/styles";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";

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

export const sessionId = uuid()
export const sessionIdContext = createContext('')

const authToken = AuthTokenProvider.retrieveToken()

const wsLink = new WebSocketLink({
    uri: `${window.location.protocol === 'https:' ? 'wss':'ws'}://${window.location.host}/graphql`,
    options: {
        reconnect: true,
        connectionParams: {
        authToken,
            sessionId
        }
    }
})

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: wsLink
} as any)

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

render(
    <ApolloProvider client={client}>
        <sessionIdContext.Provider value={sessionId}>
            <HashRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <App />
                </ThemeProvider>
            </HashRouter>
        </sessionIdContext.Provider>
    </ApolloProvider>,
document.getElementById('app')
)
