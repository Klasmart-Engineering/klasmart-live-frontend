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
import {
    dialogsState,
    shouldShowNoOrgProfileState,
    shouldShowNoStudentRoleState,
} from "./model/appModel";
import { Auth } from "./pages/account/auth";
import { NoPageFoundDialog } from "./pages/no-pages/noPageFoundDialog";
import SchedulePage from "./pages/schedule";
import AnytimeStudyPage from "./pages/schedule/anytime-study";
import { UserRoute } from "./route/userRoute";
import NoOrgFoundLogo from "@/assets/img/no_org_found_icon.svg";
import NoStudentRoleLogo from "@/assets/img/no_student_role_icon.svg";
import { useQueryClient } from "@kidsloop/cms-api-client";
import Grid from "@material-ui/core/Grid";
import React,
{ useEffect } from "react";
import {
    Route,
    Router,
    Switch,
} from "react-router-dom";
import {
    useRecoilState,
    useRecoilValue,
} from "recoil";

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
    const shouldShowNoOrgProfile = useRecoilValue(shouldShowNoOrgProfileState);
    const shouldShowNoStudentRole = useRecoilValue(shouldShowNoStudentRoleState);

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
            isShowNoOrgProfile: shouldShowNoOrgProfile,
            isShowNoStudentRole: shouldShowNoStudentRole,
        });
    }, [
        authenticated,
        loading,
        shouldSelectUser,
        shouldSelectOrganization,
        shouldShowNoOrgProfile,
        shouldShowNoStudentRole,
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
                    <NoPageFoundDialog
                        open={dialogs.isShowNoOrgProfile}
                        title="signIn.noOrganization.title"
                        body="signIn.noOrganization.body"
                        imgSrc={NoOrgFoundLogo}
                        onClose={() => setDialogs({
                            ...dialogs,
                            isShowNoOrgProfile: false,
                        })} />
                    <NoPageFoundDialog
                        open={dialogs.isShowNoStudentRole}
                        title="signIn.noStudentProfile.title"
                        body="signIn.noStudentProfile.body"
                        imgSrc={NoStudentRoleLogo}
                        onClose={() => setDialogs({
                            ...dialogs,
                            isShowNoStudentRole: false,
                        })} />
                </>
            )}
            <ExternalNavigationDialog />
        </Grid>
    );
}
