import {
    TEXT_COLOR_LIVE_PRIMARY,
    TEXT_COLOR_STUDY_PRIMARY,
} from "@/config";
import {
    createStyles,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    makeStyles,
    Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    listItemRoot: {
        width: `auto`,
        margin: theme.spacing(2),
        marginBottom: theme.spacing(3),
        borderRadius: 10,
        backgroundColor: theme.palette.background.paper,
        "&:last-child":{
            marginBottom: theme.spacing(1),
        },
        "&:hover": {
            background: theme.palette.background.paper,
        },
    },
    listItemSecondAction: {
        paddingRight: `6rem`,
    },
    listItemText: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    listItemTextLivePrimary: {
        color: TEXT_COLOR_LIVE_PRIMARY,
    },
    listItemTextStudyPrimary: {
        color: TEXT_COLOR_STUDY_PRIMARY,
    },
    listItemTrailing: {
        pointerEvents: `none`,
        right: 40,
    },
    noMarginBottom: {
        marginBottom: 0,
    },
}));

export interface Props {
    leading: React.ReactElement;
    title: string;
    subtitle?: string;
    trailing?: React.ReactNode;
    onClick?: () => void | Promise<void>;
    isStudySchedule?: boolean;
    isAnytimeStudy?: boolean;
}

export default function ScheduleListItem (props: Props) {
    const {
        leading,
        title,
        subtitle,
        trailing,
        onClick,
        isStudySchedule,
        isAnytimeStudy,
    } = props;
    const classes = useStyles();

    return (
        <ListItem
            button
            className={clsx(classes.listItemRoot, {
                [classes.listItemSecondAction]: !!trailing,
                [classes.noMarginBottom]: isAnytimeStudy,
            })}
            onClick={onClick}
        >
            <ListItemAvatar>{leading}</ListItemAvatar>
            <ListItemText
                disableTypography
                primary={(
                    <Typography
                        variant="body1"
                        className={clsx(classes.listItemText, {
                            [classes.listItemTextLivePrimary]: !isAnytimeStudy,
                            [classes.listItemTextStudyPrimary]: isStudySchedule,
                        })}
                    >
                        {title}
                    </Typography>
                )}
                secondary={(
                    <Typography
                        variant="caption"
                        color="textSecondary"
                    >
                        {subtitle}
                    </Typography>
                )}
            />
            {trailing && <ListItemSecondaryAction className={classes.listItemTrailing}>{trailing}</ListItemSecondaryAction>}
        </ListItem>
    );
}
