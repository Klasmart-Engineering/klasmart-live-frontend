import { useSelectedUserValue } from "@/app/data/user/atom";
import { Class } from "@/app/data/user/dto/sharedDto";
import { getRandomReportType, ReportType } from "@/app/components/report/share";
import {
    LIVE_COLOR,
    TEXT_COLOR_CONSTRAST_DEFAULT,
} from "@/config";
import { Box, CircularProgress, Typography } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import React, { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilValue } from "recoil";
import { randomClassState } from "@/app/model/appModel";
import { useReportContext } from "@/app/context-provider/report-context";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        width: `auto`,
        padding: theme.spacing(3, 2),
        margin: theme.spacing(2),
        marginBottom: 0,
        borderRadius: theme.spacing(1.25),
        backgroundColor: LIVE_COLOR,
    },
    title: {
        fontWeight: theme.typography.fontWeightRegular as number,
        color: TEXT_COLOR_CONSTRAST_DEFAULT,
    },
    loadingRoot: {
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        width: `auto`,
        padding: theme.spacing(3, 2),
        margin: theme.spacing(2),
        marginBottom: 0,
        borderRadius: theme.spacing(1.25),
        backgroundColor: LIVE_COLOR,
    }
}));

export const InsightMessage = () => {
    const classes = useStyles();
    const selectedUser = useSelectedUserValue();
    const {
        loadingInsightMessage, 
        insightMessage : data } = useReportContext();
    const randomClass = useRecoilValue<Class>(randomClassState);
    const [ messageId, setMessageId ] = useState<string>();
    const [ randomType, setRandomType ] = useState<ReportType>();

    useEffect(() => {
        let tempRandomType: ReportType;
        if(!data) {
            setMessageId(undefined);
            return;
        };
        do{
            tempRandomType = getRandomReportType();
        } while (tempRandomType === ReportType.PARENT_DASHBOARD);
        setRandomType(tempRandomType);
        switch(tempRandomType){
            case ReportType.LIVE_CLASS:
                setMessageId(data.attedance_label_id);
                break;
            case ReportType.STUDY_ASSESSMENTS:
                setMessageId(data.assignment_label_id);
                break;
            case ReportType.LEARNING_OUTCOMES:
                setMessageId(data.learning_outcome_achivement_label_id);
                break;
        }
    },[ data ])

    if(loadingInsightMessage){
        return (
            <Box className={classes.loadingRoot}>
                <CircularProgress size={20} className={classes.title} />
            </Box>
        )
    }

    return (
        <Box className={classes.root}>
            <Typography
                className={classes.title}
                variant="body2"
            > 
                <FormattedMessage
                    id={messageId ?? "report_msg_no_data"}
                    values={{
                        Name :`${selectedUser?.given_name} ${selectedUser?.family_name}`,
                        name :`${selectedUser?.given_name} ${selectedUser?.family_name}`,
                        ClassName: randomClass?.class_name ?? ``,
                        AttendedCount:data?.attedance_label_params.attended_count,
                        ScheduledCount:data?.attedance_label_params.scheduled_count,
                        AttendCompareLastWeek:data?.attedance_label_params.attend_compare_last_week,
                        AttendCompareLast3Week:data?.attedance_label_params.attend_compare_last_3_week,
                        LOCompareClass: randomType === ReportType.LIVE_CLASS ?
                            data?.attedance_label_params.lo_compare_class :
                            data?.learning_outcome_achivement_label_params.lo_compare_class,
                        LOCompareClass3week: randomType === ReportType.LIVE_CLASS ?
                            data?.attedance_label_params.lo_compare_class_3_week :
                            data?.learning_outcome_achivement_label_params.lo_compare_class_3_week,
                            AssignCompleteCount: data?.assignment_label_params.assign_complete_count,
                        AssignmentCompleteCount: data?.assignment_label_params.assignment_complete_count,
                        AssignCompareClass: data?.assignment_label_params.assign_compare_class,
                        AssignCompareClass3week: data?.assignment_label_params.assign_compare_class_3_week,
                        AssignmentCount: data?.assignment_label_params.assignment_count,
                        AssignCompare3Week: data?.assignment_label_params.assign_compare_3_week,
                        AssignCompareLastWeek: data?.assignment_label_params.assign_compare_last_week,
                        LearntLoCount: data?.learning_outcome_achivement_label_params.learnt_lo_count,
                        AchievedLoCount: data?.learning_outcome_achivement_label_params.achieved_lo_count,
                        LOCompareLastWeek: data?.learning_outcome_achivement_label_params.lo_compare_last_week,
                        LOCompareLast3Week: data?.learning_outcome_achivement_label_params.lo_compare_last_3_week,
                        LOReviewCompareClass: data?.learning_outcome_achivement_label_params.lo_review_compare_class,
                    }}
                />
            </Typography>
        </Box>
    );
};

