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
import LiveLayout from "./pages/home/live/live";
import ReportLayout from "./pages/home/report/report";

export const mainNavBar = [{
    name: "live",
    path: "/live",
}, {
    name: "library",
    path: "/library/my-content-list",
}, {
    name: "schedule",
    path: "/schedule/calendar",
}, {
    name: "assessments",
    path: "/assessments/assessment-list",
}, {
    name: "report",
    path: "/report",
}]

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

    return (
        <Switch>
            <Route path="/live" component={LiveLayout} />
            <Route path="/library" component={CMS} />
            <Route path="/schedule" component={CMS} />
            <Route path="/assessments" component={CMS} />
            <Route path="/report" component={ReportLayout} />
            <Route path="/classroom" component={Layout} />
            <Route path="/password-change" component={PasswordChange} />
            <Route path="/password-changed" component={PasswordChanged} />
            <Route path="/password-forgot" component={PasswordForgot} />
            <Route path="/password-restore" component={PasswordRestore} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route component={LiveLayout} />
        </Switch>
    );
}

export default App;
