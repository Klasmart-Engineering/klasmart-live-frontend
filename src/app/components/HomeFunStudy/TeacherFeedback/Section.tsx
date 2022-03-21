import {
    FeedbackScore,
    Score,
} from "./FeedbackScore";
import ScheduleLoading from "@/app/components/Schedule/Loading";
import JessIcon from "@/assets/img/home-fun-study/jess.svg";
import { THEME_COLOR_BACKGROUND_LIST } from "@/config";
import { useGetStudentAssessments } from "@kidsloop/cms-api-client";
import { TeacherComment } from "@kidsloop/cms-api-client/dist/api/assessment";
import {
    Box,
    createStyles,
    Grid,
    makeStyles,
    Typography,
    useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{
    useCallback,
    useMemo,
} from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    feedbackComment: {
        color: theme.palette.grey[700],
    },
    feedbackTitle: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    feedbackNoComment: {
        color: theme.palette.grey[700],
        fontStyle: `italic`,
    },
    jessIcon: {
        position: `absolute`,
        bottom: `-5px`,
        right: `20px`,
        width: `79px`,
        height: `60px`,
    },
}));

export interface HomeFunStudyTeacherFeedbackProps {
    organizationId: string;
    scheduleId: string;
}

interface TeacherFeedback {
    comment: string;
    score: number;
}

export default function HomeFunStudyTeacherFeedback ({ organizationId, scheduleId }: HomeFunStudyTeacherFeedbackProps) {
    const theme = useTheme();
    const classes = useStyles();
    const { data: studentAssessmentsData, isFetching: isFetchingStudentAssessments } = useGetStudentAssessments({
        type: `home_fun_study`,
        schedule_ids: scheduleId,
        org_id: organizationId,
    });

    const teacherFeedback = useMemo((): TeacherFeedback | undefined => {
        const getTeacherComment = (teacherComments?: TeacherComment[]) => {
            if(!teacherComments?.length) return ``;
            return teacherComments[0].comment;
        };

        if(!studentAssessmentsData?.list?.length) return;
        const studentAssessment = studentAssessmentsData.list[0];

        return {
            comment: getTeacherComment(studentAssessment.teacher_comments),
            score: studentAssessment.score,
        };
    }, [ studentAssessmentsData ]);

    const isValidFeedbackScore = useCallback((score?: number) => {
        if(!score) return false;
        return Object.values(Score).includes(score);
    }, []);

    if (isFetchingStudentAssessments) return <ScheduleLoading />;
    if (!teacherFeedback) return null;

    return <Box
        p={3}
        mx={3}
        my={2}
        position="relative"
        borderRadius={theme.spacing(4)}
        bgcolor={THEME_COLOR_BACKGROUND_LIST}
    >
        <Grid
            container
            direction="column"
            spacing={2}
        >
            <Grid item>
                <Typography
                    variant="h6"
                    className={classes.feedbackTitle}>
                    <FormattedMessage
                        id="homeFunStudy.feedback.title"
                        defaultMessage={`Teacher's Feedback`}/>
                </Typography>
            </Grid>
            <Grid item>
                <Box
                    bgcolor={theme.palette.common.white}
                    borderRadius={theme.spacing(1.5)}
                    p={2}
                >
                    <Typography
                        variant="body1"
                        className={clsx(classes.feedbackComment, {
                            [classes.feedbackNoComment] : !teacherFeedback.comment,
                        })}
                    >
                        {teacherFeedback.comment ? teacherFeedback.comment : <FormattedMessage
                            id="homeFunStudy.feedback.notAvailable"
                            defaultMessage={`No teacher comment available`}
                        />}
                    </Typography>
                </Box>
            </Grid>
            <Grid item>
                {isValidFeedbackScore(teacherFeedback.score) && <FeedbackScore score={teacherFeedback.score}/>}
            </Grid>
        </Grid>
        <img
            src={JessIcon}
            className={classes.jessIcon}/>
    </Box>;
}
