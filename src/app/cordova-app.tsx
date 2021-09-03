import Join from "../pages/join/join";
import { RoomWithContext } from "../pages/room/room-with-context";
import { SelectOrgDialog } from "./dialogs/account/selectOrgDialog";
import { SelectUserDialog } from "./dialogs/account/selectUserDialog";
import { ExternalNavigationDialog } from "./dialogs/externalNavigationDialog";
import { HomeFunStudyDialog } from "./dialogs/home-fun-study/homeFunStudyDialog";
import { Auth } from "./pages/account/auth";
import { Schedule } from "./pages/schedule/schedule";
import { UserRoute } from "./route/userRoute";
import Grid from "@material-ui/core/Grid";
import React from "react";
import {
    Route,
    Router,
    Switch,
} from "react-router-dom";

export function App ({ history }: {
    history: any;
}): JSX.Element {
    return (
        <Grid
            container
            wrap="nowrap"
            direction="column"
            justify="space-between"
            style={{
                height: `100%`,
                overflow: `hidden`,
            }}
        >
            <Router history={history}>
                <Switch>
                    <UserRoute
                        path="/schedule"
                        component={Schedule} />
                    <UserRoute
                        path="/join"
                        component={Join} />
                    <UserRoute
                        path="/room"
                        component={RoomWithContext} />
                    <Route
                        path="/auth"
                        render={() => <Auth useInAppBrowser={true} />} />
                    <UserRoute
                        path="/"
                        component={Schedule} />
                </Switch>
            </Router>
            <SelectOrgDialog />
            <SelectUserDialog />
            <ExternalNavigationDialog />
            <HomeFunStudyDialog />
        </Grid>
    );
}
