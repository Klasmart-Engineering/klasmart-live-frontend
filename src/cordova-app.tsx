import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import Grid from "@material-ui/core/Grid";
import { SelectOrgDialog } from "./pages/account/selectOrgDialog";
import { Auth } from "./pages/account/auth";
import { RoomWithContext } from "./pages/room/room";
import Join from "./pages/join/join";
import { Schedule } from "./pages/schedule/schedule";
import { UserRoute } from "./components/userRoute";
import { SelectUserDialog } from "./pages/account/selectUserDialog";

export function App({ history }: {
    history: any;
}): JSX.Element {
    return (
        <Grid
            wrap="nowrap"
            container
            direction="column"
            justify="space-between"
            style={{ height: "100%", overflow: "hidden" }}
        >
            <Router history={history}>
                <Switch>
                    <UserRoute path="/schedule" component={Schedule} />
                    <UserRoute path="/join" component={Join} />
                    <UserRoute path="/room" component={RoomWithContext} />
                    <Route path="/auth" render={() => <Auth useInAppBrowser={true} />} />
                    <UserRoute path="/" component={Schedule} />
                </Switch>
            </Router>
            <SelectOrgDialog />
            <SelectUserDialog />
        </Grid>
    )
}