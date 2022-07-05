import {
    BACKGROUND_PROCESS_GREY,
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG,
} from '@/config';
import {
    Button,
    createStyles,
    makeStyles,
    Typography,
    useTheme,
} from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const useStyles = makeStyles((theme) => createStyles({
    actionButton: {
        position: `relative`,
        borderRadius: theme.spacing(4),
    },
    titleText: {
        fontWeight: theme.typography.fontWeightBold as number,
        fontSize: `1rem`,
    },
}));

interface Props {
    backgroundColor?: string;
    color?: string;
    className?: string;
    title: React.ReactNode;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    disabled?: boolean;
    width?: number;
    minHeight?: number;
    minWidth?: number;
    spacing?: number;
    onClick?: () => void;
}

export default function ScheduleJoinButton (props: Props) {
    const {
        backgroundColor = THEME_COLOR_PINK_BUTTON_SCHEDULE_DIALOG,
        color = THEME_COLOR_BACKGROUND_PAPER,
        title,
        className,
        startIcon,
        endIcon,
        disabled = false,
        width,
        minHeight = 45,
        minWidth = 140,
        spacing = 2.0,
        onClick,
    } = props;
    const classes = useStyles();
    const theme = useTheme();

    return (
        <Button
            disableElevation
            className={clsx(classes.actionButton, className)}
            variant="contained"
            disabled={disabled}
            endIcon={disabled ? undefined : endIcon}
            startIcon={disabled ? undefined : startIcon}
            style={{
                backgroundColor: disabled ? BACKGROUND_PROCESS_GREY : backgroundColor,
                color: disabled ? THEME_COLOR_BACKGROUND_PAPER : color,
                width,
                minHeight,
                minWidth,
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
