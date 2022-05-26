import AppBar from "@/app/components/layout/AppBar";
import BackButton from "@/app/components/layout/BackButton";
import ReportLearningOutcomesList from "@/app/components/report/learning-outcomes/List";
import ParentDashboard from "@/app/components/report/parent-dashboard/List";
import { ReportType } from "@/app/components/report/share";
import { ReportContextProvider } from "@/app/context-provider/report-context";
import React,
{ useCallback, useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { useHistory } from "react-router-dom";

interface Props{
    type: ReportType;
}

export default function ReportPage ({ type }: Props) {
    const intl = useIntl();
    const history = useHistory();
    const [ header, setHeader ] = useState<string>(``);

    const handleBackClick = () => {
        history.goBack();
    };

    useEffect(() => {
        switch(type){
            case ReportType.PARENT_DASHBOARD:
                setHeader(`hamburger.parentsDashboard`);
                break;
            case ReportType.LEARNING_OUTCOMES:
                setHeader(`report.report.learningOutcomes`);
                break;
            }
    },[])

    const renderList = useCallback(() => {
        switch(type){
        case ReportType.PARENT_DASHBOARD:
            return <ParentDashboard />;
        case ReportType.LEARNING_OUTCOMES:
            return <ReportLearningOutcomesList />;
        }
    }, [ type ]);

    return (
        <>
            <AppBar
                title={header && intl.formatMessage({
                    id: header,
                })}
                leading={<BackButton onClick={handleBackClick} />}
            />
            <ReportContextProvider>
                {renderList()}
            </ReportContextProvider>
        </>
    );
}