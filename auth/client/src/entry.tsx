import "@babel/polyfill";

import "node-source-han-sans-sc/SourceHanSansSC-Regular-all.css";
import "typeface-nanum-square-round";
// import "./assets/css/index.min.css";

import CssBaseline from "@material-ui/core/CssBaseline";
import { ThemeProvider } from "@material-ui/core/styles";
import React, { useMemo } from "react";
import * as ReactDOM from "react-dom";
import { RawIntlProvider } from "react-intl";
import { HashRouter, Route, Switch } from "react-router-dom";
import { themeProvider } from "./themeProvider";
import { SignIn } from "./pages/signin";
import { getLanguage } from "./locale/locale";
import { Continue } from "./pages/continue";
import { Layout } from "./pages/layout";
import { SignUp } from "./pages/signup";
import { Verify } from "./pages/verify";
import { ResetPassword } from "./pages/resetPassword";

const routes = [
    { path: "/reset", Component: ResetPassword},
    { path: "/verify", Component: Verify },
    { path: "/signup", Component: SignUp },
    { path: "/signin", Component: SignIn },
    { path: "/login", Component: SignIn },
    { path: "/continue", Component: Continue },
    { path: "/", Component: SignIn },
]


function ClientSide() {
    const memos = useMemo(() => {
        const url = new URL(window.location.href);
        return { hostName: url.hostname };
    }, []);

    const testing = memos.hostName === "localhost";

    const languageCode = "en"
    const locale = getLanguage(languageCode);

    return (
        <RawIntlProvider value={locale}>
            <ThemeProvider theme={themeProvider()}>
                <CssBaseline />
                <Layout>
                    <Switch>
                    { routes.map(({ path, Component }) => (
                        <Route key={path} exact path={path}>
                            {({ match }) => (
                                <Component />
                            )}
                        </Route>
                    ))}
                    </Switch>
                </Layout>
            </ThemeProvider>
        </RawIntlProvider>
    );
}

async function main() {
    const div = document.getElementById("app");
    ReactDOM.render(
        <HashRouter>
            <ClientSide />
        </HashRouter>,
        div);
}

main();
