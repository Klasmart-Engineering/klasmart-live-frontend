import AppBar from "@/app/components/layout/AppBar";
import StudyScheduleList from "@/app/components/Schedule/Study/List";
import BackIcon from "@/assets/img/join_study_back_icon.svg";
import { THEME_COLOR_BACKGROUND_BACK_BUTTON } from "@/config";
import { ClassType } from "@/store/actions";
import { Box } from "@mui/material";
import {
    createStyles,
    makeStyles,
} from "@mui/styles";
import React from "react";
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

    const handleBackClick = () => {
        history.goBack();
    };

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
            <AppBar
                title={getTitle()}
                leading={(
                    <img
                        src={BackIcon}
                        className={classes.backButton}
                        alt="Back icon"
                        onClick={handleBackClick}
                    />
                )}
            />
            <StudyScheduleList classType={classType} />
            <Box flex="0" />
        </>
    );
}
