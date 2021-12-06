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
    shouldClearCookieState,
    shouldShowNoOrgProfileState,
} from "@/app/model/appModel";
import {
    ScheduleAppBarItem,
    useScheduleTabValue,
} from "@/app/model/scheduleModel";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React,
{
    useCallback,
    useEffect,
} from "react";
import {
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
}

export default function SchedulePage (props: Props) {
    const classes = useStyles();
    const scheduleTab = useScheduleTabValue();
    const user = useSelectedUserValue();
    const organization = useSelectedOrganizationValue();
    const shouldShowNoOrgProfile = useRecoilValue(shouldShowNoOrgProfileState);
    const { addOnBack, removeOnBack } = useCordovaSystemContext();
    const { actions } = useAuthenticationContext();
    const setShouldClearCookie = useSetRecoilState(shouldClearCookieState);
    const NO_ORG_BACK_BUTTON_CLICKED_ID = `noOrgBackButtonClickedID`;

    const SelectedScheduleTabContent = useCallback((scheduleTab: ScheduleAppBarItem) => {
        switch (scheduleTab) {
        case ScheduleAppBarItem.LIVE: return <LiveScheduleList />;
        case ScheduleAppBarItem.STUDY: return <StudyScheduleList />;
        }
    }, [ scheduleTab ]);

    const onNoOrgBackButtonClicked = () => {
        actions?.signOut();
        setShouldClearCookie(true);
    };

    useEffect(() => {
        if (shouldShowNoOrgProfile) {
            addOnBack?.({
                id: NO_ORG_BACK_BUTTON_CLICKED_ID,
                onBack: onNoOrgBackButtonClicked,
            });
        } else {
            removeOnBack?.(NO_ORG_BACK_BUTTON_CLICKED_ID);
        }
    }, [ shouldShowNoOrgProfile ]);

    return (
        <React.Fragment key={`${user?.user_id}-${organization?.organization_id}`}>
            <Header isHomeRoute />
            {SelectedScheduleTabContent(scheduleTab)}
            <ScheduleBottomAppBar />
        </React.Fragment>
    );
}
