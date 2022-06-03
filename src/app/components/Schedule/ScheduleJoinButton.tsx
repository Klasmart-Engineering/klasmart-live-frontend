import { 
    DISABLED_BUTTON_BACKGROUND_SCHEDULE_DIALOG, 
    DISABLED_BUTTON_COLOR_SCHEDULE_DIALOG, 
    THEME_COLOR_BACKGROUND_PAPER, 
    THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG 
} from '@/config';
import { Button, createStyles, makeStyles, Typography, useTheme } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => createStyles({
    actionButton: {
        position: `relative`,
        borderRadius: theme.spacing(4),
    },
    titleText: {
        fontWeight: theme.typography.fontWeightBold as number,
        fontSize: `1rem`,
    }
}));

interface Props {
    backgroundColor?: string;
    color?: string;
    title: React.ReactNode;
    endIcon?: React.ReactNode;
    disabled?: boolean;
    width?: number;
    minHeight?: number;
    spacing?: number;
    onClick?: () => void;
}

export default function ScheduleJoinButton (props: Props) {
    const {
        backgroundColor = THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG,
        color = THEME_COLOR_BACKGROUND_PAPER,
        title,
        endIcon,
        disabled = false,
        width,
        minHeight = 45,
        spacing = 2.0,
        onClick
    } = props;
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Button
            className={classes.actionButton}
            disableElevation
            variant="contained"
            disabled={disabled}
            endIcon={disabled ? undefined : endIcon}
            style={{
                backgroundColor: disabled ? DISABLED_BUTTON_BACKGROUND_SCHEDULE_DIALOG : backgroundColor,
                color: disabled ? DISABLED_BUTTON_COLOR_SCHEDULE_DIALOG : color,
                width: width,
                minHeight,
            }}
            onClick={onClick}
        >
            <Typography 
                className={classes.titleText}
                style={{
                    marginRight: !disabled ? theme.spacing(spacing) : 0,
                }}
            >
                {title}
            </Typography>
        </Button>
    );
}
