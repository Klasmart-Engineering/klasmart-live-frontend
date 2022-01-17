import {
    Grid,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import { grey } from "@material-ui/core/colors";
import { StyledIcon } from '@styled-icons/styled-icon';
import clsx from "clsx";
import React,
{ useRef } from "react";
import {
    LongPressDetectEvents,
    useLongPress,
} from "use-long-press";

const useStyles = makeStyles((theme: Theme) => ({
    item:{
        cursor: `pointer`,
        padding: `12px 20px`,
        "&:hover": {
            backgroundColor: theme.palette.grey[200],
        },
    },
    itemIcon:{
        padding: 10,
        background: `#fff`,
        border: `1px solid`,
        borderRadius: 50,
        marginBottom: 10,
        "& svg":{
            height: 20,
            width: 20,
        },
    },
    active:{
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
	active: boolean;
	onClick: (buttonRef?: React.MutableRefObject<HTMLDivElement | null>) => void;
    onCloseAlert?: () => void;
	icon: StyledIcon;
	title: string;
    disabled?: boolean;
}

function ViewMode (props: ViewModeProps) {
    const {
        active,
        onClick,
        onCloseAlert,
        icon: Icon,
        title,
        disabled,
    } = props;

    const buttonRef = useRef<HTMLDivElement | null>(null);
    const classes = useStyles();

    const clickEvent = useLongPress(() => onClick(buttonRef), {
        onStart: () => onClick(buttonRef),
        onFinish: () => onCloseAlert && onCloseAlert(),
        onCancel: () => onCloseAlert && onCloseAlert(),
        threshold: 500,
        captureEvent: true,
        cancelOnMovement: false,
        detect: LongPressDetectEvents.BOTH,
    });

    return (
        <Grid item>
            <Grid
                ref={buttonRef}
                container
                direction="column"
                alignItems="center"
                className={clsx(classes.item, {
                    [classes.active]: active,
                    [classes.disabled]: !active && disabled && !onCloseAlert,
                    [classes.disabledShowTooltip]: onCloseAlert && disabled,
                })}
                {...clickEvent}>
                <Grid
                    item
                    className={classes.itemIcon}>
                    <Icon />
                </Grid>
                <Grid item>
                    <Typography>{title}</Typography>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ViewMode;
