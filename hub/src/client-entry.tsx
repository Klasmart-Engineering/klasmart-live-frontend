import "@babel/polyfill";
import LogRocket from "logrocket";
LogRocket.init("8qowji/badanamu-learning-pass");

import "node-source-han-sans-sc/SourceHanSansSC-Regular-all.css";
import "typeface-nanum-square-round";
import "./assets/css/index.min.css";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import React, { useMemo } from "react";
import * as ReactDOM from "react-dom";
import { RawIntlProvider } from "react-intl";
import { Provider, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";
import { Layout } from "./layout";
import { createDefaultStore, State } from "./store/store";
import { themeProvider } from "./themeProvider";
import { getLanguage } from "./utils/locale";

function ClientSide() {
    const memos = useMemo(() => {
        const url = new URL(window.location.href);
        return { hostName: url.hostname };
    }, []);

    const testing = memos.hostName === "localhost";

    const languageCode = useSelector((state: State) => state.ui.locale || "");
    const locale = getLanguage(languageCode);

    return (
        <RawIntlProvider value={locale}>
            <ThemeProvider theme={themeProvider()}>
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
