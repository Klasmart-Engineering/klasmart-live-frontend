import { UserContext } from "./entry";
import React, { useContext } from "react";
import useCordovaInitialize from "./cordova-initialize";
import { HashRouter, Route, Switch } from "react-router-dom";
import { Signup } from "./pages/account/signup";
import { Signin } from "./pages/account/signin";
import { PasswordChange } from "./pages/account/password/password-change";
import { PasswordChanged } from "./pages/account/password/password-changed";
import { PasswordForgot } from "./pages/account/password/password-forgot";
import { PasswordRestore } from "./pages/account/password/password-restore";
import { Room } from "./pages/room/room";
import { Join } from "./pages/join/join";

export function App(): JSX.Element {
    const [cordovaReady, permissions] = useCordovaInitialize();
    const { camera, name, teacher } = useContext(UserContext);

    if (!cordovaReady || !permissions) { return <>Loading...</> }
    if (!name || camera === undefined) { return <Join /> }

    return (
        <HashRouter>
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
        </HashRouter>
    )
}
