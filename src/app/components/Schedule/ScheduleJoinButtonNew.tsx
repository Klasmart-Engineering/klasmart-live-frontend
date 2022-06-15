import {
    BACKGROUND_PROCESS_GREY,
    SCHEDULE_CARD_BACKGROUND,
    THEME_COLOR_BACKGROUND_PAPER,
} from '@/config';
import {
    Button,
    createStyles,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => createStyles({
    actionButton: {
        position: `relative`,
        borderRadius: theme.spacing(4),
        width: `50%`,
    },
    titleText: {
        fontWeight: theme.typography.fontWeightBold as number,
        fontSize: `0.8rem`,
        marginLeft: theme.spacing(1.5),
        whiteSpace: `nowrap`,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.2rem`,
        },
    },
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

export default function ScheduleJoinButtonNew (props: Props) {
    const {
        backgroundColor = SCHEDULE_CARD_BACKGROUND,
        color = THEME_COLOR_BACKGROUND_PAPER,
        title,
        endIcon,
        disabled = false,
        width,
        minHeight = 32,
        spacing = 2.0,
        onClick,
    } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isMdUp = useMediaQuery(theme.breakpoints.up(`md`));

    return (
        <Button
            disableElevation
            className={classes.actionButton}
            variant="contained"
            disabled={disabled}
            endIcon={disabled ? undefined : endIcon}
            style={{
                backgroundColor: disabled ? BACKGROUND_PROCESS_GREY : backgroundColor,
                color: color,
                width: width,
                minHeight: isMdUp ? 46 : minHeight,
            }}
            onClick={onClick}
        >
            <Typography
                className={classes.titleText}
                style={{
                    marginRight: disabled ? 0 : theme.spacing(spacing),
                    marginLeft: disabled ? 0 : theme.spacing(1.5),
                }}
            >
                {title}
            </Typography>
        </Button>
    );
}
