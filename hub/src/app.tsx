import * as QueryString from "query-string";
import * as React from "react";
import { useEffect } from "react";
import { isEdge, isIE, isIOS, isMobile, isMobileSafari } from "react-device-detect";
import { useStore } from "react-redux";
import { Route, Switch, useLocation } from "react-router-dom";
import NavBar from "./components/styled/navbar/navbar";
import { Layout } from "./layout";
import { Login } from "./pages/account/login";
import { PasswordChange } from "./pages/account/password/password-change";
import { PasswordChanged } from "./pages/account/password/password-changed";
import { PasswordForgot } from "./pages/account/password/password-forgot";
import { PasswordRestore } from "./pages/account/password/password-restore";
import { Signup } from "./pages/account/signup";
import { App as CMS } from "./pages/cms/cms-frontend-web/src/App";
import Home from "./pages/home/home";
import { ActionTypes } from "./store/actions";

export function App() {
    const store = useStore();
    const location = useLocation();

    useEffect(() => {
        // console.log(location)
    }, [location]);

    useEffect(() => {
        const userInformation = {
            isEdge,
            isIE,
            isIOS,
            isMobile,
            isMobileSafari,
        };

        store.dispatch({ type: ActionTypes.USER_AGENT, payload: userInformation });
    }, []);

    const navigation = new Map([
        // TODO: Add and adjust during Schedule integration
        ["home", [{
            name: "live",
            path: `/home?${QueryString.stringify({ component: "live" })}`,
        }, {
            name: "library",
            path: `/home?${QueryString.stringify({ component: "library" })}`,
        }, {
            name: "schedule",
            path: `/home?${QueryString.stringify({ component: "schedule" })}`,
        }, {
            name: "assessments",
            path: `/home?${QueryString.stringify({ component: "assessments" })}`,
        }, {
            name: "report",
            path: `/home?${QueryString.stringify({ component: "report" })}`,
        }]],
        ["library", []],
    ]);

    const path = location.pathname === "/" ? "home" : location.pathname.substring(1);

    function redirectSubmodule() {
        const searchParams = new URLSearchParams(location.search);
        const activeNavMenu = searchParams.get("component") ? searchParams.get("component") : "live";
        if (activeNavMenu === "library") { return <CMS /> }
        return <Home />
    }

    return (
        <>
            <NavBar menuLabels={navigation.get(path)} />
            <Switch>
                <Route path="/home" render={() => redirectSubmodule()} />
                <Route path="/library" component={CMS} />
                <Route path="/classroom" component={Layout} />
                <Route path="/password-change" component={PasswordChange} />
                <Route path="/password-changed" component={PasswordChanged} />
                <Route path="/password-forgot" component={PasswordForgot} />
                <Route path="/password-restore" component={PasswordRestore} />
                <Route path="/signup" component={Signup} />
                <Route path="/login" component={Login} />
                <Route path="/" render={() => redirectSubmodule()} />
            </Switch>
        </>
    );
}

export default App;
