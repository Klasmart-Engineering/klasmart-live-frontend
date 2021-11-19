import { Header } from "@/app/components/layout/header";
import ScheduleBottomAppBar from "@/app/components/Schedule/BottomAppBar";
import LiveScheduleList from "@/app/components/Schedule/Live/List";
import StudyScheduleList from "@/app/components/Schedule/Study/List";
import {
    useSelectedOrganizationValue,
    useSelectedUserValue,
} from "@/app/data/user/atom";
import {
    ScheduleAppBarItem,
    useScheduleTabValue,
} from "@/app/model/scheduleModel";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React,
{ useCallback } from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
}

export default function SchedulePage (props: Props) {
    const classes = useStyles();
    const scheduleTab = useScheduleTabValue();
    const user = useSelectedUserValue();
    const organization = useSelectedOrganizationValue();

    const SelectedScheduleTabContent = useCallback((scheduleTab: ScheduleAppBarItem) => {
        switch (scheduleTab) {
        case ScheduleAppBarItem.LIVE: return <LiveScheduleList />;
        case ScheduleAppBarItem.STUDY: return <StudyScheduleList />;
        }
    }, [ scheduleTab ]);

    return (
        <React.Fragment key={`${user?.user_id}-${organization?.organization_id}`}>
            <Header isHomeRoute />
            {SelectedScheduleTabContent(scheduleTab)}
            <ScheduleBottomAppBar />
        </React.Fragment>
    );
}
