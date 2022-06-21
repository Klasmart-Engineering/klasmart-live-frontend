import { ButtonBase, Theme, Typography } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { grey } from "@mui/material/colors";
import { StyledIcon } from '@styled-icons/styled-icon';
import clsx from "clsx";
import React,
{
    RefObject,
    useRef,
} from "react";
import {
    LongPressDetectEvents,
    useLongPress,
} from "use-long-press";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(1.5, 2.5),
        display: `flex`,
        flexDirection: `column`,
        "&:hover": {
            backgroundColor: theme.palette.grey[200],
        },
    },
    itemIcon: {
        padding: theme.spacing(1.25),
        background: theme.palette.common.white,
        border: `1px solid`,
        borderRadius: theme.spacing(5),
        marginBottom: theme.spacing(1.25),
        width: 20,
    },
    active: {
        backgroundColor: theme.palette.background.default,
        pointerEvents: `none`,
    },
    disabled: {
        opacity: `0.3`,
        pointerEvents: `none`,
    },
    disabledShowTooltip: {
        color: grey[400],
        "&:hover": {
            backgroundColor: theme.palette.background.paper,
        },
        userSelect: `none`,
    },
}));

interface ViewModeProps {
	active?: boolean;
	onClick: (buttonRef: RefObject<HTMLButtonElement>) => unknown;
    onCloseAlert?: () => unknown;
	icon: StyledIcon;
	title: string;
    disabled?: boolean;
    disableLongPress?: boolean;
}

function ViewMode (props: ViewModeProps) {
    const {
        active,
        onClick,
        onCloseAlert,
        icon: Icon,
        title,
        disabled,
        disableLongPress,
    } = props;

    const buttonRef = useRef<HTMLButtonElement>(null);
    const classes = useStyles();

    const clickEvent = useLongPress(disableLongPress ? null : () => onClick(buttonRef), {
        onStart: () => onClick(buttonRef),
        onFinish: () => onCloseAlert && onCloseAlert(),
        onCancel: () => onCloseAlert && onCloseAlert(),
        threshold: 500,
        captureEvent: true,
        cancelOnMovement: false,
        detect: LongPressDetectEvents.BOTH,
    });

    return (
        <ButtonBase
            ref={buttonRef}
            disableRipple
            title={title}
            className={clsx(classes.root, {
                [classes.active]: active,
                [classes.disabled]: !active && disabled && !onCloseAlert,
                [classes.disabledShowTooltip]: onCloseAlert && disabled,
            })}
            onClick={() => disableLongPress && onClick(buttonRef)}
            {...clickEvent}
        >
            <div className={classes.itemIcon}>
                <Icon />
            </div>
            <Typography>{title}</Typography>
        </ButtonBase>
    );
}

export default ViewMode;
