import "@babel/polyfill";

import "node-source-han-sans-sc/SourceHanSansSC-Regular-all.css";
import "typeface-nanum-square-round";
// import "./assets/css/index.min.css";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import React, { useMemo } from "react";
import * as ReactDOM from "react-dom";
import { RawIntlProvider } from "react-intl";
import { HashRouter } from "react-router-dom";
import { themeProvider } from "./themeProvider";
import { getLanguage } from "./locale";
import { Login } from "./login";

// import { Provider, useSelector } from "react-redux";
// import { PersistGate } from "redux-persist/integration/react";
// import { createDefaultStore, State } from "./store/store";
function ClientSide() {
    const memos = useMemo(() => {
        const url = new URL(window.location.href);
        return { hostName: url.hostname };
    }, []);

    const testing = memos.hostName === "localhost";

    const languageCode = "en"//useSelector((state: State) => state.ui.locale || "");
    const locale = getLanguage(languageCode);

    return (
        <RawIntlProvider value={locale}>
            <ThemeProvider theme={themeProvider()}>
                <CssBaseline />
                <Login />
            </ThemeProvider>
        </RawIntlProvider>
    );
}

async function main() {
    // const { store, persistor } = createDefaultStore();

    const div = document.getElementById("app");
    ReactDOM.render(
        <HashRouter>
            <ClientSide />
        </HashRouter>,
        div);
}

main();
