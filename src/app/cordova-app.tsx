import Join from "../pages/join/join";
import { RoomWithContext } from "../pages/room/room-with-context";
import { useAuthenticationContext } from "./context-provider/authentication-context";
import { SelectOrgDialog } from "./dialogs/account/selectOrgDialog";
import { SelectUserDialog } from "./dialogs/account/selectUserDialog";
import { SettingsDialog } from "./dialogs/account/settingsDialog";
import { SettingsLanguageDialog } from "./dialogs/account/settingsLanguageDialog";
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

    const { authenticated } = useAuthenticationContext();

    return (
        <Grid
            container
            wrap="nowrap"
            direction="column"
            justifyContent="space-between"
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
            { authenticated && (
                <>
                    <SelectOrgDialog />
                    <SelectUserDialog />
                    <HomeFunStudyDialog />
                    <SettingsDialog />
                    <SettingsLanguageDialog />
                </>
            )}
            <ExternalNavigationDialog />
        </Grid>
    );
}
