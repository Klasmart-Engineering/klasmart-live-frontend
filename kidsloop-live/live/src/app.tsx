import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import { createHashHistory } from 'history'
import Grid from "@material-ui/core/Grid";
import { Header } from "./components/header";
import { Signup } from "./pages/account/signup";
import { Signin } from "./pages/account/signin";
import { PasswordChange } from "./pages/account/password/password-change";
import { PasswordChanged } from "./pages/account/password/password-changed";
import { PasswordForgot } from "./pages/account/password/password-forgot";
import { PasswordRestore } from "./pages/account/password/password-restore";
import { Room } from "./pages/room/room";
import { Join } from "./pages/join/join";
import { Schedule } from "./pages/schedule/schedule";
import { State } from "./store/store";
import { OrientationType } from "./store/actions";
import { setDeviceOrientation } from "./store/reducers/location";

export function App(): JSX.Element {
    const dispatch = useDispatch();
    const history = createHashHistory();
    const deviceOrientation = useSelector((state: State) => state.location.deviceOrientation);

    useEffect(() => {
        if (deviceOrientation === OrientationType.LANDSCAPE) {
            if (screen.orientation && screen.orientation.lock) {
                screen.orientation.unlock();
                screen.orientation.lock("portrait")
                    .then(() => {
                        dispatch(setDeviceOrientation(OrientationType.PORTRAIT));
                    })
                    .catch((err) => {
                        console.log("screen.orientation.lock() is not available on this device.");
                    });
                return;
            }
        }
    }, [])

    return (
        <Grid
            container
            direction="column"
            justify="space-between"
            style={{ height: "100%", overflow: "hidden" }}
        >
            <Header />
            <Router history={history}>
                <Switch>
                    <Route path="/schedule" component={Schedule} />
                    <Route path="/join" component={Join} />
                    <Route path="/room" component={Room} />
                    <Route path="/password-change" component={PasswordChange} />
                    <Route path="/password-changed" component={PasswordChanged} />
                    <Route path="/password-forgot" component={PasswordForgot} />
                    <Route path="/password-restore" component={PasswordRestore} />
                    <Route path="/signup" component={Signup} />
                    <Route path="/signin" component={Signin} />
                    <Route path="/" component={Schedule} />
                </Switch>
            </Router>
        </Grid>
    )
}
