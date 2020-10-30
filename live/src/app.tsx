import { UserContext } from "./entry";
import React, { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { Router, HashRouter, Route, Switch, useHistory } from "react-router-dom";
import { Signup } from "./pages/account/signup";
import { Signin } from "./pages/account/signin";
import { PasswordChange } from "./pages/account/password/password-change";
import { PasswordChanged } from "./pages/account/password/password-changed";
import { PasswordForgot } from "./pages/account/password/password-forgot";
import { PasswordRestore } from "./pages/account/password/password-restore";
import { Room } from "./pages/room/room";
import { Join } from "./pages/join/join";
import { createHashHistory } from 'history'

export function App(): JSX.Element {
    const history = createHashHistory();

    return (
        <Router history={history}>
            <Switch>
                <Route path="/password-change" component={PasswordChange} />
                <Route path="/password-changed" component={PasswordChanged} />
                <Route path="/password-forgot" component={PasswordForgot} />
                <Route path="/password-restore" component={PasswordRestore} />
                <Route path="/room" component={Room} />
                <Route path="/signup" component={Signup} />
                <Route path="/signin" component={Signin} />
                <Route path="/" component={Join} />
            </Switch>
        </Router>
    )
}
