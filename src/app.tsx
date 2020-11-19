import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Router, Route, Switch } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { Header } from "./components/header";
import { SelectOrgDialog, useShouldSelectOrganization } from "./pages/account/selectOrgDialog";
import { Auth } from "./pages/account/auth";
import { Signup } from "./pages/account/signup";
import { Signin } from "./pages/account/signin";
import { PasswordChange } from "./pages/account/password/password-change";
import { PasswordChanged } from "./pages/account/password/password-changed";
import { PasswordForgot } from "./pages/account/password/password-forgot";
import { PasswordRestore } from "./pages/account/password/password-restore";
import { Room } from "./pages/room/room";
import { Join } from "./pages/join/join";
import { Schedule } from "./pages/schedule/schedule";
import { Fallback } from "./pages/error";
import { State } from "./store/store";
import { OrientationType } from "./store/actions";
import { setSelectOrgDialogOpen } from "./store/reducers/control";
import { setDeviceOrientation } from "./store/reducers/location";

export function App({ history, refresh }: {
    history: any;
    refresh: () => void;
}): JSX.Element {
    const dispatch = useDispatch();
    const deviceOrientation = useSelector((state: State) => state.location.deviceOrientation);

    const { errCode, shouldSelect } = useShouldSelectOrganization();

    useEffect(() => {
        if (shouldSelect) { dispatch(setSelectOrgDialogOpen(true)) }
        if (deviceOrientation === OrientationType.LANDSCAPE) {
            if (screen.orientation && screen.orientation.lock) {
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

    // TODO (Isu): There is a problem with this logic, so disable it for a while.
    // if (errCode === 401) {
    //     return (
    //         <Fallback
    //             titleMsgId="err_401_title"
    //             subtitleMsgId="err_401_subtitle"
    //             errCode={`${errCode.toString()}`}
    //         />
    //     );
    // } else if (errCode === 403) {
    //     return (
    //         <Fallback
    //             titleMsgId="err_403_title"
    //             subtitleMsgId="err_403_subtitle"
    //             errCode={`${errCode.toString()}`}
    //         />
    //     );
    // }

    return (
        <Grid
            wrap="nowrap"
            container
            direction="column"
            justify="space-between"
            style={{ height: "100%", overflow: "hidden" }}
        >
            <Router history={history}>
                <Header />
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
                    <Route path="/auth" render={() => <Auth refresh={refresh} useInAppBrowser={false} />} />
                    <Route path="/" component={Schedule} />
                </Switch>
            </Router>
            <SelectOrgDialog />
        </Grid>
    )
}
