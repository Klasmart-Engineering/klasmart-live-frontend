import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import AnytimeStudyScheduleList from "@/app/components/Schedule/Study/AnytimeStudy/List";
import {
    Box,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
}

export default function AnytimeStudyPage (props: Props) {
    const classes = useStyles();
    const history = useHistory();

    const handleBackClick = () => {
        history.goBack();
    };

    return (
        <>
            <AppBar
                title={`Anytime Study`}
                leading={<BackButton onClick={handleBackClick} />}
            />
            <AnytimeStudyScheduleList />
            <Box flex="0" />
        </>
    );
}
