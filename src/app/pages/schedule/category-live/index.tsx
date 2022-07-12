import LiveScheduleList from "@/app/components/Schedule/Live/List";
import ScheduleTopBar from "@/app/components/Schedule/TopBar";
import {
    ScheduleAppBarItem,
    useSetScheduleTab,
} from "@/app/model/scheduleModel";
import { ClassType } from "@/store/actions";
import { Box } from "@material-ui/core";
import React,
{ useEffect } from "react";

export default function LiveStudyListPage () {
    const setScheduleTab = useSetScheduleTab();

    useEffect(() => {
        setScheduleTab(ScheduleAppBarItem.LIVE);
        return () => {
            setScheduleTab(``);
        };
    }, []);

    return (
        <>
            <ScheduleTopBar classType={ClassType.LIVE} />
            <LiveScheduleList />
            <Box flex="0" />
        </>
    );
}
