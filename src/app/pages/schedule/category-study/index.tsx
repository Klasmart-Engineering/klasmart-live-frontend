import AnytimeStudyScheduleList from "@/app/components/Schedule/Study/AnytimeStudy/List";
import StudyScheduleList from "@/app/components/Schedule/Study/List";
import ScheduleTopBar from "@/app/components/Schedule/TopBar";
import {
    StudyTopBarItem,
    useStudyTopBarValue,
} from "@/app/model/StudyModel";
import { THEME_COLOR_BACKGROUND_BACK_BUTTON } from "@/config";
import { ClassType } from "@/store/actions";
import {
    Box,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React,
{ useCallback } from "react";
import { useIntl } from "react-intl";
import {
    useHistory,
    useParams,
} from "react-router-dom";

const useStyles = makeStyles((theme) => createStyles({
    backButton: {
        borderRadius: `50%`,
        width: `2rem`,
        height: `2rem`,
        background: THEME_COLOR_BACKGROUND_BACK_BUTTON,
        color: theme.palette.common.white,
        padding: theme.spacing(0.75),
        marginLeft: theme.spacing(1.25),
    },
}));

interface Params {
    classType: ClassType;
}
export default function StudyListPage () {
    const { classType } = useParams<Params>();
    const intl = useIntl();
    const history = useHistory();
    const classes = useStyles();
    const studyTopBar = useStudyTopBarValue();
    const handleBackClick = () => {
        history.goBack();
    };

    const SelectedStudyTab = useCallback((studyTopBar: StudyTopBarItem) => {
        switch (studyTopBar) {
        case StudyTopBarItem.STUDY: return <StudyScheduleList classType={classType} />;
        case StudyTopBarItem.ANYTIME: return <AnytimeStudyScheduleList classType={classType} />;
        }
    }, [ studyTopBar ]);

    const getTitle = () => {
        return classType === ClassType.STUDY ?
            intl.formatMessage({
                id: `schedule_studyTab`,
                defaultMessage: `Study`,
            }) :
            intl.formatMessage({
                id: `schedule_studyHomeFunStudy`,
                defaultMessage: `Home Fun Study`,
            });
    };
    return (
        <>
            <ScheduleTopBar classType={ClassType.STUDY} />
            {SelectedStudyTab(studyTopBar)}
            <Box flex="0" />
        </>
    );
}
