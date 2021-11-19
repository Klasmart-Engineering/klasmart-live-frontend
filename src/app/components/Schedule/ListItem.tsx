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
    listItemSecondAction: {
        paddingRight: `6rem`,
    },
    listItemTextPrimary: {
        color: `#0C3680`,
        fontWeight: 600, // theme.typography.fontWeightBold
    },
    listItemTrailing: {
        pointerEvents: `none`,
    },
}));

export interface Props {
    leading: React.ReactElement;
    title: string;
    subtitle?: string;
    trailing?: React.ReactNode;
    onClick?: () => void | Promise<void>;
}

export default function ScheduleListItem (props: Props) {
    const {
        leading,
        title,
        subtitle,
        trailing,
        onClick,
    } = props;
    const classes = useStyles();

    return (
        <ListItem
            button
            className={clsx({
                [classes.listItemSecondAction]: !!trailing,
            })}
            onClick={onClick}
        >
            <ListItemAvatar>{leading}</ListItemAvatar>
            <ListItemText
                disableTypography
                primary={(
                    <Typography
                        variant="body1"
                        className={classes.listItemTextPrimary}
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
