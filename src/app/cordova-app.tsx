import {
    ScheduleAppBarItem,
    useScheduleTabValue,
} from "./model/scheduleModel";
import { OnBoardingPage } from "./pages/on-boarding/onBoardingPage";
import { ParentDashboardPage } from "./pages/parent-dashboard/parentDashboardPage";
import ReportPage from "./pages/report";
import { ReportDetailPage } from "./pages/reportDetail/reportDetailPage";
import LiveStudyListPage from "./pages/schedule/category-live";
import StudyListPage from "./pages/schedule/category-study";
import { SelectTypePage } from "./pages/select-type/selectTypePage";
import { ReportType } from "@/app/components/report/share";
import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import { usePopupContext } from "@/app/context-provider/popup-context";
import { useSelectedUserValue } from "@/app/data/user/atom";
import {
    SelectOrgDialog,
    useShouldSelectOrganization,
} from "@/app/dialogs/account/selectOrgDialog";
import {
    SelectUserDialog,
    useShouldSelectUser,
} from "@/app/dialogs/account/selectUserDialog";
import { useSignOut } from "@/app/dialogs/account/useSignOut";
import { ExternalNavigationDialog } from "@/app/dialogs/externalNavigationDialog";
import {
    dialogsState,
    showedUpgradeDevicePopupState,
} from "@/app/model/appModel";
import { Auth } from "@/app/pages/account/auth";
import SchedulePage from "@/app/pages/schedule";
import AnytimeStudyPage from "@/app/pages/schedule/anytime-study";
import HomeFunStudyPage from "@/app/pages/schedule/home-fun-study/[scheduleId]";
import SettingsPage from "@/app/pages/settings";
import PrivacyPage from "@/app/pages/settings/privacy";
import SelectLanguagePage from "@/app/pages/settings/select-language";
import { UserRoute } from "@/app/route/userRoute";
import { PARENT_ROUTES } from "@/config";
import { WebApp } from "@/pages/webApp";
import { ClassType } from "@/store/actions";
import { useQueryClient } from "@kl-engineering/cms-api-client";
import Grid from "@material-ui/core/Grid";
import { History } from 'history';
import React,
{ useEffect } from "react";
import { useIntl } from "react-intl";
import {
    Route,
    Router,
    Switch,
} from "react-router-dom";
import { useRecoilState } from "recoil";

export function CordovaApp ({ history }: {
    history: History<unknown>;
}): JSX.Element {
    const {
        authenticated,
        loading,
    } = useAuthenticationContext();
    const { signOut } = useSignOut();
    const cmsQueryClient = useQueryClient();
    const user = useSelectedUserValue();
    const {
        isIOS,
        isAndroid,
        shouldUpgradeDevice,
    } = useCordovaSystemContext();
    const [ showedUpgradeDevicePopup, setShowedUpgradeDevicePopup ] = useRecoilState(showedUpgradeDevicePopupState);
    const { showPopup } = usePopupContext();
    const intl = useIntl();
    const { shouldSelectUser } = useShouldSelectUser();
    const { shouldSelectOrganization } = useShouldSelectOrganization();
    const [ dialogs, setDialogs ] = useRecoilState(dialogsState);
    const scheduleTabValue = useScheduleTabValue();

    useEffect(() => {
        if(!scheduleTabValue) return;
        switch(scheduleTabValue){
        case ScheduleAppBarItem.LIVE:
            history.push(`/schedule/category-live`);
            break;
        case ScheduleAppBarItem.STUDY:
            history.push(`/schedule/category-study/${ClassType.STUDY}`);
            break;
        case ScheduleAppBarItem.HOME_FUN_STUDY:
            history.push(`/schedule/category-study/${ClassType.HOME_FUN_STUDY}`);
            break;
        }
    }, []);

    useEffect(() => {
        if (loading) return;
        if (!authenticated) {
            cmsQueryClient.getQueryCache()
                .clear();
            cmsQueryClient.getMutationCache()
                .clear();
            signOut();
            return;
        }
        if (PARENT_ROUTES.some((route) => history.location.pathname.includes(route))) return;
        setDialogs({
            ...dialogs,
            isSelectUserOpen: shouldSelectUser,
            isSelectOrganizationOpen: !shouldSelectUser && shouldSelectOrganization,
        });
    }, [
        loading,
        authenticated,
        shouldSelectUser,
        shouldSelectOrganization,
        history.location.pathname,
    ]);

    useEffect(() => {
        if(!user || !shouldUpgradeDevice || showedUpgradeDevicePopup) return;

        setShowedUpgradeDevicePopup(true);
        if(isIOS) {
            showPopup({
                variant: `info`,
                title: intl.formatMessage({
                    id: `live.class.updateRequired.title`,
                    defaultMessage: `iOS Update Required`,
                }),
                description: [
                    intl.formatMessage({
                        id: `live.class.updateRequired.body`,
                        defaultMessage: `We recommend that you update your device to {version} or later to enjoy the full KidsLoop experience`,
                    }, {
                        version: `<b>iOS 15.1</b>`,
                    }),
                ],
                closeLabel: intl.formatMessage({
                    id: `common_ok`,
                    defaultMessage: `OK`,
                }),
            });
        }
        else if(isAndroid) {
            // TODO: Implement popup for Android if needed
        }

    }, [
        user,
        isIOS,
        showedUpgradeDevicePopup,
        shouldUpgradeDevice,
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
                        path="/schedule/category-live"
                        component={LiveStudyListPage}
                    />
                    <UserRoute
                        path="/schedule/category-study/:classType"
                        component={StudyListPage}
                    />
                    <UserRoute
                        path="/schedule/home-fun-study/:scheduleId"
                        component={HomeFunStudyPage}
                    />
                    <UserRoute
                        path="/settings/select-language"
                        component={SelectLanguagePage}
                    />
                    <UserRoute
                        path="/settings/privacy"
                        component={PrivacyPage}
                    />
                    <UserRoute
                        path="/settings"
                        component={SettingsPage}
                    />
                    <UserRoute
                        path="/parent-dashboard"
                        component={ParentDashboardPage}
                    />
                    <UserRoute
                        path="/report/parent-dashboard"
                        component={() => <ReportPage type={ReportType.PARENT_DASHBOARD} />}
                    />
                    <UserRoute
                        path="/report/detail"
                        component={ReportDetailPage}
                    />
                    <UserRoute
                        path="/report/live-class"
                        component={() => <ReportPage type={ReportType.LIVE_CLASS} />}
                    />
                    <UserRoute
                        path="/report/study-assessment"
                        component={() => <ReportPage type={ReportType.STUDY_ASSESSMENTS} />}
                    />
                    <UserRoute
                        path="/report/learning-outcomes"
                        component={() => <ReportPage type={ReportType.LEARNING_OUTCOMES} />}
                    />
                    <UserRoute
                        path="/schedule/anytime-study/:classType"
                        component={AnytimeStudyPage}
                    />
                    <UserRoute
                        path="/room"
                        component={WebApp}
                    />
                    <Route
                        path="/auth"
                        render={() => <Auth useInAppBrowser />}
                    />
                    <Route
                        path="/on-boarding"
                        component={OnBoardingPage}
                    />
                    <UserRoute
                        path="/select-user-role"
                        component={SelectTypePage}
                    />
                    <UserRoute
                        path="/"
                        component={SchedulePage}
                    />
                </Switch>
            </Router>
            {authenticated && (
                <>
                    <SelectOrgDialog history={history} />
                    <SelectUserDialog history={history} />
                    <ExternalNavigationDialog />
                </>
            )}
        </Grid>
    );
}
