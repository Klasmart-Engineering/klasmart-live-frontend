import AppBar from "@/app/components/layout/AppBar";
import LiveScheduleList from "@/app/components/Schedule/Live/List";
import ScheduleTopBar from "@/app/components/Schedule/TopBar";
import BackIcon from "@/assets/img/join_study_back_icon.svg";
import { THEME_COLOR_BACKGROUND_BACK_BUTTON } from "@/config";
import { ClassType } from "@/store/actions";
import {
    Box,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

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

export default function LiveStudyListPage () {
    const intl = useIntl();
    const history = useHistory();
    const classes = useStyles();

    const handleBackClick = () => {
        history.goBack();
    };

    return (
        <>
            <ScheduleTopBar classType={ClassType.LIVE} />
            <LiveScheduleList />
            <Box flex="0" />
        </>
    );
}
