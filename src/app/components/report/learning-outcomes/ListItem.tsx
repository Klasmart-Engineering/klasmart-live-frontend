import { LearningOutcomeStatus } from "@/app/components/report/share";
import {
    BUTTON_COLOR_NOT_ACHIEVED,
    LEARNING_COLOR_TEXT,
    LIVE_COLOR,
    THEME_COLOR_HOME_FUN_SCHEDULE_CARD,
} from "@/config";
import { Chip, ListItem, ListItemText, Typography } from "@mui/material";
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        padding: theme.spacing(2, 2.5),
        borderRadius: theme.spacing(1.25),
        margin: theme.spacing(1, 0, 1.5),
        backgroundColor: theme.palette.background.paper,
    },
    chip: {
        backgroundColor: BUTTON_COLOR_NOT_ACHIEVED,
        borderRadius: theme.spacing(1.5),
        padding: theme.spacing(1.5, 1),
        marginLeft: theme.spacing(1),
    },
    achievedListItem: {
        backgroundColor: LIVE_COLOR,
    },
    inProcessListItem: {
        backgroundColor: THEME_COLOR_HOME_FUN_SCHEDULE_CARD,
    },
    title: {
        fontWeight: theme.typography.fontWeightRegular as number,
        color: LEARNING_COLOR_TEXT,
        display: `-webkit-box`,
        overflow: `hidden`,
        WebkitBoxOrient: `vertical`,
        WebkitLineClamp: 2,
    },
    text: {
        fontSize: `0.65rem`,
        color: theme.palette.background.paper,
    },
}));

interface Props {
    title: string;
    status: string;
}

interface FormatData{
    class?: string;
    statusId: string;
}

export default function LearningOutcomeListItem (props: Props) {

    const { title, status } = props;
    const classes = useStyles();

    const formatData: Record<string, FormatData> = {
        [LearningOutcomeStatus.ACHIEVED]: {
            class: classes.achievedListItem,
            statusId: `parentsDashboard.learningOutcome.achieved`,
        },
        [LearningOutcomeStatus.NOT_ACHIEVED]: {
            statusId: `parentsDashboard.learningOutcome.NotAchieved`,
        },
        [LearningOutcomeStatus.IN_PROGRESS]: {
            class: classes.inProcessListItem,
            statusId: `parentsDashboard.learningOutcome.InProgress`,
        },
    };

    return (
        <ListItem
            disableGutters
            className={classes.root}
        >
            <ListItemText
                disableTypography
                primary={
                    <Typography
                        className={classes.title}
                        variant="body1"
                    > {title}
                    </Typography>}
            />
            <Chip
                className={clsx(classes.chip, formatData[status].class)}
                size="small"
                label={
                    <Typography
                        className={classes.text}
                    >
                        <FormattedMessage id={formatData[status].statusId} />
                    </Typography>
                }
            />
        </ListItem>
    );
}
