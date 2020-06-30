import * as React from "react";
import { useEffect } from "react";
import { isEdge, isIE, isIOS, isMobile, isMobileSafari } from "react-device-detect";
import { useStore } from "react-redux";
import { Route, Switch } from "react-router-dom";
import { Login } from "./pages/account/login";
import { PasswordChange } from "./pages/account/password/password-change";
import { PasswordChanged } from "./pages/account/password/password-changed";
import { PasswordForgot } from "./pages/account/password/password-forgot";
import { PasswordRestore } from "./pages/account/password/password-restore";
import { Signup } from "./pages/account/signup";
import { Layout } from "./pages/classroom/layout";
import { ActionTypes } from "./store/actions";

export function App() {
    const store = useStore();

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
            <Route path="/classroom" component={Layout} />
            <Route path="/password-change" component={PasswordChange} />
            <Route path="/password-changed" component={PasswordChanged} />
            <Route path="/password-forgot" component={PasswordForgot} />
            <Route path="/password-restore" component={PasswordRestore} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/" component={Layout} />
        </Switch>
    );
}

export default App;
