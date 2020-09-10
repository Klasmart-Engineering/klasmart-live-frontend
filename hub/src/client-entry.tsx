import "@babel/polyfill";
import LogRocket from "logrocket";
LogRocket.init("8qowji/badanamu-learning-pass");

import "node-source-han-sans-sc/SourceHanSansSC-Regular-all.css";
import "typeface-nanum-square-round";
import "./assets/css/index.min.css";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme, responsiveFontSizes, Theme, ThemeProvider } from "@material-ui/core/styles";
import { PaletteOptions } from "@material-ui/core/styles/createPalette";
import React, { useMemo } from "react";
import * as ReactDOM from "react-dom";
import { RawIntlProvider } from "react-intl";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import App from "./app";
import { Layout } from "./layout";
import { createDefaultStore, State } from "./store/store";
import { getLanguage } from "./utils/locale";

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

function ClientSide() {
    const memos = useMemo(() => {
        const url = new URL(window.location.href);
        return { hostName: url.hostname };
    }, []);

    const testing = memos.hostName === "localhost";

    const darkMode = useSelector((state: State) => state.ui.darkMode);
    const languageCode = useSelector((state: State) => state.ui.locale || "");
    const locale = getLanguage(languageCode);
    const localeTypography = setTypography(languageCode);

    const typography = {
        button: {
            textTransform: "none",
        },
        fontFamily: localeTypography.localeFontFamily,
        fontWeightBold: localeTypography.localeWeightBold,
        fontWeightLight: localeTypography.localeWeightLight,
        fontWeightMedium: localeTypography.localeWeightMedium,
        fontWeightRegular: localeTypography.localeWeightRegular,
    } as any; // TODO: Seems like a bug in materialUI's types

    const overrides = {
        MuiAppBar: {
            root: {
                backgroundColor: darkMode === "light" ? "#fafafa" : "#041125",
            },
        },
        MuiTable: {
            root: {
                backgroundColor: darkMode === "light" ? "#fff" : "#05152e",
            },
        },
        MuiTableCell: {
            stickyHeader: {
                backgroundColor: darkMode === "light" ? "#fafafa" : "#041125",
            },
        },
    };
    const palette: PaletteOptions = {
        background: {
            default: darkMode === "light" ? "#fafafa" : "#030D1C",
            paper: darkMode === "light" ? "#fff" : "#030D1C",
        },
        primary: {
            contrastText: "#fff",
            dark: "#1896ea",
            light: "#0E78D5",
            main: "#0E78D5",
        },
    };

    let theme: Theme;
    if (darkMode === "light") {
        palette.type = "light";
        palette.background = { default: "white" };
        theme = createMuiTheme({ overrides, palette, typography });
    } else {
        palette.type = "dark";
        theme = createMuiTheme({ overrides, palette, typography });
    }

    theme = responsiveFontSizes(theme);

    return (
        <RawIntlProvider value={locale}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Layout />
            </ThemeProvider>
        </RawIntlProvider>
    );
}

async function main() {
    const { store, persistor } = createDefaultStore();
    if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const axe = require("react-axe");
        // axe(React, ReactDOM, 1000);
    }

    const div = document.getElementById("app");
    ReactDOM.render(
        <BrowserRouter>
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ClientSide />
                </PersistGate>
            </Provider>
        </BrowserRouter>,
        div);
}

main();
