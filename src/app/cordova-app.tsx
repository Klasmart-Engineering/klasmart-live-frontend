import Join from "../pages/join/join";
import { RoomWithContext } from "../pages/room/room-with-context";
import { useAuthenticationContext } from "./context-provider/authentication-context";
import {
    SelectOrgDialog,
    useShouldSelectOrganization,
} from "./dialogs/account/selectOrgDialog";
import {
    SelectUserDialog,
    useShouldSelectUser,
} from "./dialogs/account/selectUserDialog";
import { SettingsDialog } from "./dialogs/account/settingsDialog";
import { SettingsLanguageDialog } from "./dialogs/account/settingsLanguageDialog";
import { useSignOut } from "./dialogs/account/useSignOut";
import { ExternalNavigationDialog } from "./dialogs/externalNavigationDialog";
import { HomeFunStudyDialog } from "./dialogs/home-fun-study/homeFunStudyDialog";
import { dialogsState } from "./model/appModel";
import { Auth } from "./pages/account/auth";
import SchedulePage from "./pages/schedule";
import AnytimeStudyPage from "./pages/schedule/anytime-study";
import { UserRoute } from "./route/userRoute";
import { useQueryClient } from "@kidsloop/cms-api-client";
import Grid from "@material-ui/core/Grid";
import React,
{ useEffect } from "react";
import {
    Route,
    Router,
    Switch,
} from "react-router-dom";
import { useRecoilState } from "recoil";

export function App ({ history }: {
    history: any;
}): JSX.Element {
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const {
        authenticated,
        loading,
    } = useAuthenticationContext();
    const { shouldSelectUser } = useShouldSelectUser();
    const { shouldSelectOrganization } = useShouldSelectOrganization();
    const { signOut } = useSignOut();
    const cmsQueryClient = useQueryClient();

    useEffect(() => {
        console.log({
            authenticated,
            loading,
        });

        if (loading) return;
        if (!authenticated) {
            cmsQueryClient.getQueryCache().clear();
            cmsQueryClient.getMutationCache().clear();
            signOut();
            return;
        }
        setDialogs({
            ...dialogs,
            isSelectUserOpen: shouldSelectUser,
            isSelectOrganizationOpen: !shouldSelectUser && shouldSelectOrganization,
        });
    }, [
        authenticated,
        loading,
        shouldSelectUser,
        shouldSelectOrganization,
    ]);

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
                        path="/schedule/anytime-study"
                        component={AnytimeStudyPage}
                    />
                    <UserRoute
                        path="/schedule"
                        component={SchedulePage}
                    />
                    <UserRoute
                        path="/join"
                        component={Join}
                    />
                    <UserRoute
                        path="/room"
                        component={RoomWithContext}
                    />
                    <Route
                        path="/auth"
                        render={() => <Auth useInAppBrowser={true} />}
                    />
                    <UserRoute
                        path="/"
                        component={SchedulePage}
                    />
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
