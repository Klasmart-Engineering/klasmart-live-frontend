import StyledIcon from "@/components/styled/icon";
import {
    Chip,
    createStyles,
    makeStyles,
} from "@material-ui/core";
import {
    SentimentNeutral as AverageIcon,
    SentimentSatisfied as GoodIcon,
    SentimentVeryDissatisfied as FairIcon,
    SentimentVeryDissatisfied as PoorIcon,
    SentimentVerySatisfied as ExcellentIcon,
} from "@styled-icons/material-outlined";
import React,
{
    ReactElement,
    useCallback,
} from "react";
import { useIntl } from "react-intl";

interface StyledChipProps {
    color: string;
}

const useChipStyles = makeStyles((theme) => createStyles({
    root: {
        backgroundColor: theme.palette.common.white,
        borderRadius: theme.spacing(1.5),
    },
    label: {
        color: (props: StyledChipProps) => props.color,
    },
}));

const useStyles = makeStyles((theme) => createStyles({
    chipIcon: {
        marginLeft: theme.spacing(0.7),
        marginRight: theme.spacing(-0.8),
    },
}));

export enum Score {
    POOR = 1, FAIR = 2, AVERAGE = 3, GOOD = 4, EXCELLENT = 5
}
interface FeedbackScoreProps {
    score: Score;
}
interface TeacherFeedback {
    icon: ReactElement;
    color: string;
    labelId: string;
    defaultLabel: string;
}

export function FeedbackScore ({ score }: FeedbackScoreProps) {
    const intl = useIntl();

    const getTeacherFeedbackByStudentScore = useCallback((score: Score): TeacherFeedback => {
        switch (score) {
        case Score.POOR:
            return {
                icon: <PoorIcon/>,
                labelId: `homeFunStudy.feedback.score.poor`,
                defaultLabel: `Poor`,
                color: `#D32F2F`,
            };
        case Score.FAIR:
            return {
                icon: <FairIcon/>,
                labelId: `homeFunStudy.feedback.score.fair`,
                defaultLabel: `Poor`,
                color: `#DC6F17`,
            };
        case Score.AVERAGE:
            return {
                icon: <AverageIcon/>,
                labelId: `homeFunStudy.feedback.score.average`,
                defaultLabel: `Poor`,
                color: `#FFC107`,
            };
        case Score.GOOD:
            return {
                icon: <GoodIcon/>,
                labelId: `homeFunStudy.feedback.score.good`,
                defaultLabel: `Good`,
                color: `#A1CC41`,
            };
        case Score.EXCELLENT:
            return {
                icon: <ExcellentIcon/>,
                labelId: `homeFunStudy.feedback.score.excellent`,
                defaultLabel: `Excellent`,
                color: `#4CAF50`,
            };
        }
    }, []);

    const teacherFeedback = getTeacherFeedbackByStudentScore(score);

    const chipClasses = useChipStyles({
        color: teacherFeedback.color,
    });

    const classes = useStyles();

    return (
        <Chip
            classes={chipClasses}
            size="medium"
            icon={
                <StyledIcon
                    className={classes.chipIcon}
                    icon={teacherFeedback.icon}
                    size="large"
                    color={teacherFeedback.color}/>
            }
            label={intl.formatMessage({
                id: teacherFeedback.labelId,
                defaultMessage: teacherFeedback.defaultLabel,
            })}/>
    );
}
