import AnytimeStudyScheduleList from "@/app/components/Schedule/Study/AnytimeStudy/List";
import StudyScheduleList from "@/app/components/Schedule/Study/List";
import ScheduleTopBar from "@/app/components/Schedule/TopBar";
import {
    HomeFunAppBarItem,
    useHomeFunTopBarValue,
} from "@/app/model/HomeFunModel";
import {
    ScheduleAppBarItem,
    useSetScheduleTab,
} from "@/app/model/scheduleModel";
import {
    StudyTopBarItem,
    useStudyTopBarValue,
} from "@/app/model/StudyModel";
import { ClassType } from "@/store/actions";
import { Box } from "@material-ui/core";
import React,
{
    useCallback,
    useEffect,
} from "react";
import { useParams } from "react-router-dom";

interface Params {
    classType: ClassType;
}
export default function StudyListPage () {
    const { classType } = useParams<Params>();
    const studyTopBar = useStudyTopBarValue();
    const hfsTopBar = useHomeFunTopBarValue();
    const setScheduleTab = useSetScheduleTab();

    useEffect(() => {
        setScheduleTab(classType === ClassType.STUDY ? ScheduleAppBarItem.STUDY: ScheduleAppBarItem.HOME_FUN_STUDY);
        return () => {
            setScheduleTab(``);
        };
    }, []);

    const SelectedStudyTab = useCallback((studyTopBar: StudyTopBarItem) => {
        switch (studyTopBar) {
        case StudyTopBarItem.STUDY: return (<StudyScheduleList classType={ClassType.STUDY} />);
        case StudyTopBarItem.ANYTIME: return (<AnytimeStudyScheduleList classType={ClassType.STUDY} />);
        }
    }, [ studyTopBar ]);

    const SelectedHomeFunStudyTab = useCallback((hfsTopBar: HomeFunAppBarItem) => {
        switch (hfsTopBar) {
        case HomeFunAppBarItem.HOME_ACTIVITY: return (<StudyScheduleList classType={ClassType.HOME_FUN_STUDY} />);
        case HomeFunAppBarItem.ANYTIME: return (<AnytimeStudyScheduleList classType={ClassType.HOME_FUN_STUDY} />);
        }
    }, [ hfsTopBar ]);

    return (
        <>
            <ScheduleTopBar classType={classType} />
            {classType === ClassType.STUDY ? SelectedStudyTab(studyTopBar) : SelectedHomeFunStudyTab(hfsTopBar)}
            <Box flex="0" />
        </>
    );
}
