import { Header } from "@/app/components/layout/header";
import ScheduleBottomAppBar from "@/app/components/Schedule/BottomAppBar";
import LiveScheduleList from "@/app/components/Schedule/Live/List";
import StudyScheduleList from "@/app/components/Schedule/Study/List";
import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import {
    useSelectedOrganizationValue,
    useSelectedUserValue,
} from "@/app/data/user/atom";
import {
    isShowOnBoardingState,
    shouldClearCookieState,
    shouldShowNoOrgProfileState,
    shouldShowNoStudentRoleState,
} from "@/app/model/appModel";
import {
    ScheduleAppBarItem,
    useScheduleTabValue,
} from "@/app/model/scheduleModel";
import React,
{
    useCallback,
    useEffect,
} from "react";
import {
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

export default function SchedulePage () {
    const scheduleTab = useScheduleTabValue();
    const user = useSelectedUserValue();
    const organization = useSelectedOrganizationValue();
    const shouldShowNoOrgProfile = useRecoilValue(shouldShowNoOrgProfileState);
    const shouldShowNoStudentRole = useRecoilValue(shouldShowNoStudentRoleState);
    const { addOnBack, removeOnBack } = useCordovaSystemContext();
    const { actions } = useAuthenticationContext();
    const setShouldClearCookie = useSetRecoilState(shouldClearCookieState);
    const setShowOnBoarding = useSetRecoilState(isShowOnBoardingState);
    const NO_PAGE_FOUND_BACK_BUTTON_CLICKED_ID = `noPageFoundBackButtonClickedID`;

    const SelectedScheduleTabContent = useCallback((scheduleTab: ScheduleAppBarItem) => {
        switch (scheduleTab) {
        case ScheduleAppBarItem.LIVE: return <LiveScheduleList />;
        case ScheduleAppBarItem.STUDY: return <StudyScheduleList />;
        }
    }, [ scheduleTab ]);

    const onNoOrgBackButtonClicked = () => {
        actions?.signOut();
        setShouldClearCookie(true);
        setShowOnBoarding(true);
    };

    useEffect(() => {
        if (shouldShowNoOrgProfile || shouldShowNoStudentRole) {
            addOnBack?.({
                id: NO_PAGE_FOUND_BACK_BUTTON_CLICKED_ID,
                onBack: onNoOrgBackButtonClicked,
            });
        } else {
            removeOnBack?.(NO_PAGE_FOUND_BACK_BUTTON_CLICKED_ID);
        }
    }, [ shouldShowNoOrgProfile, shouldShowNoStudentRole ]);

    return (
        <React.Fragment key={`${user?.user_id}-${organization?.organization_id}`}>
            <Header isHomeRoute />
            {SelectedScheduleTabContent(scheduleTab)}
            <ScheduleBottomAppBar />
        </React.Fragment>
    );
}
