import {
    BACKGROUND_PROCESS_GREY,
    SCHEDULE_CARD_BACKGROUND,
    SCHEDULE_HOMEFUN_TOP_BAR,
    SCHEDULE_STUDY_TOP_BAR,
    THEME_COLOR_BACKGROUND_PAPER,
} from '@/config';
import { ClassType } from '@/store/actions';
import {
    Button,
    createStyles,
    makeStyles,
    Typography,
} from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';

const MIN_HEIGHT_TABLET = 46;
const MIN_HEIGHT_MOBILE = 32;

const useStyles = makeStyles((theme) => createStyles({
    button: {
        position: `relative`,
        borderRadius: theme.spacing(4),
        width: `50%`,
        minHeight: MIN_HEIGHT_MOBILE,
        [theme.breakpoints.up(`md`)]: {
            minHeight: MIN_HEIGHT_TABLET,
        },
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
    liveButton: {
        marginRight: theme.spacing(2),
        marginLeft: theme.spacing(1.5),
    },
    liveButtonDisabled: {
        marginLeft: 0,
    },
    studyButtonStart: {
        marginRight: theme.spacing(2.5),
        marginLeft: theme.spacing(4),
    },
}));

interface Props {
  title: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  variant?: ClassType;
  onClick?: () => void;
}

export default function ScheduleJoiningButton (props: Props) {
    const {
        title,
        endIcon,
        disabled = false,
        variant,
        onClick,
    } = props;
    const classes = useStyles();

    const getClassTypeProperty = () => {
        switch(variant){
        case ClassType.LIVE:
            return {
                backgroundColor: SCHEDULE_CARD_BACKGROUND,
            };
        case ClassType.STUDY: case ClassType.REVIEW:
            return {
                backgroundColor: SCHEDULE_STUDY_TOP_BAR,
            };
        case ClassType.HOME_FUN_STUDY:
            return {
                backgroundColor: SCHEDULE_HOMEFUN_TOP_BAR,
            };
        default:
            return {
                backgroundColor: SCHEDULE_CARD_BACKGROUND,
            };
        }
    };

    return (
        <Button
            disableElevation
            className={classes.button}
            variant="contained"
            disabled={disabled}
            endIcon={!disabled && endIcon}
            style={{
                backgroundColor: disabled ? BACKGROUND_PROCESS_GREY : getClassTypeProperty().backgroundColor,
                color: THEME_COLOR_BACKGROUND_PAPER,
            }}
            onClick={onClick}
        >
            <Typography
                className={clsx(classes.titleText, {
                    [classes.liveButton]: variant === ClassType.LIVE && !disabled,
                    [classes.liveButtonDisabled]: variant === ClassType.LIVE && disabled,
                    [classes.studyButtonStart]: variant === ClassType.STUDY,
                })}
            >
                {title}
            </Typography>
        </Button>
    );
}
