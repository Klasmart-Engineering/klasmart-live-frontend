import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import AnytimeStudyScheduleList from "@/app/components/Schedule/Study/AnytimeStudy/List";
import { Box } from "@material-ui/core";
import React from "react";
import { useHistory } from "react-router";

export default function AnytimeStudyPage () {
    const history = useHistory();

    const handleBackClick = () => {
        history.goBack();
    };

    return (
        <>
            <AppBar
                showTitleInAppbar={`Anytime Study`}
                leading={<BackButton onClick={handleBackClick} />}
            />
            <AnytimeStudyScheduleList />
            <Box flex="0" />
        </>
    );
}
