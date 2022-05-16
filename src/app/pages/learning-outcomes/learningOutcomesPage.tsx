
import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import LearningOutcomes from "@/app/components/learningOutcomes/learningOutcomes";
import { ParentsContextProvider } from "@/app/context-provider/parent-context";
import React from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

export function LearningOutcomesPage () {
    const intl = useIntl();
    const history = useHistory();

    const handleBackClick = () => {
        history.goBack();
    };

    return (
        <>
            <AppBar
                title={intl.formatMessage({
                    id: `report.report.learningOutcomes`,
                })}
                leading={<BackButton onClick={handleBackClick} />}
            />
            <ParentsContextProvider>
                <LearningOutcomes />
            </ParentsContextProvider>
        </>
    );
}
