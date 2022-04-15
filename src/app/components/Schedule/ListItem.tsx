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
        paddingLeft: theme.spacing(1),
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
    listItemStudySchedule: {
        paddingLeft: theme.spacing(1),
    },
    listItemAnytimeStudy: {
        marginBottom: 0,
        padding: theme.spacing(2),
    },
    listItemTextAnyTimeStudy: {
        marginLeft: 6,
    },
}));

export interface Props {
    leading?: React.ReactElement;
    title: string | JSX.Element;
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
                [classes.listItemAnytimeStudy]: isAnytimeStudy,
                [classes.listItemStudySchedule]: isStudySchedule,
            })}
            onClick={onClick}
        >
            {leading && <ListItemAvatar>{leading}</ListItemAvatar>}
            <ListItemText
                disableTypography
                primary={(
                    <Typography
                        variant="body1"
                        className={clsx(classes.listItemText, {
                            [classes.listItemTextLivePrimary]: !isAnytimeStudy,
                            [classes.listItemTextStudyPrimary]: isStudySchedule,
                            [classes.listItemTextAnyTimeStudy]: isAnytimeStudy,
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
