import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import ParentDashboard from "@/app/components/parent/dashboard/parentDashboard";
import { ParentsContextProvider } from "@/app/context-provider/parent-context";
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
                    id: `hamburger.parentsDashboard`,
                })}
                leading={<BackButton onClick={handleBackClick} />}
            />
            <ParentsContextProvider>
                <ParentDashboard />
            </ParentsContextProvider>
        </>
    );
}
