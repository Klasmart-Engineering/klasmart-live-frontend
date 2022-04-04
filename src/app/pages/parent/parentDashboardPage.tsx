import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import ParentDashboard from "@/app/components/parent/dashboard/parentDashboard";
import React from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

export function ParentDashboardPage () {
    const intl = useIntl();
    const history = useHistory();

    const handleBackClick = () => {
        history.goBack();
    };

    return (
        <>
            <AppBar
                title={intl.formatMessage({
                    id: `settings.title`,
                })}
                leading={<BackButton onClick={handleBackClick} />}
            />
            <ParentDashboard />
        </>
    );
}
