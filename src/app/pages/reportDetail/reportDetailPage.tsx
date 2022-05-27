
import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import { ReportDetail } from "@/app/components/reportDetail/reportDetail";
import React from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

export function ReportDetailPage () {
    const intl = useIntl();
    const history = useHistory();

    const handleBackClick = () => {
        history.goBack();
    };

    return (
        <>
            <AppBar
                title={intl.formatMessage({
                    id: `report.report.title`,
                })}
                leading={<BackButton onClick={handleBackClick} />}
            />
            <ReportDetail />
        </>
    );
}
