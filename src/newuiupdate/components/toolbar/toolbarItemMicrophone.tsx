import {
    Badge,
    makeStyles,
    Theme,
    Tooltip,
} from "@material-ui/core";
import red from "@material-ui/core/colors/red";
import { fade } from '@material-ui/core/styles/colorManipulator';
import LockIcon from "@material-ui/icons/Lock";
import { MicFill as MicFillIcon } from "@styled-icons/bootstrap/MicFill";
import { MicMuteFill as MicDisabledIcon } from "@styled-icons/bootstrap/MicMuteFill";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme: Theme) => ({
    itemRoot: {
        position: `relative`,
    },
    root: {
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        fontSize: `0.75em`,
        borderRadius: 12,
        cursor: `pointer`,
        padding: 15,
        transition: `all 100ms ease-in-out`,
        color: red[500],
        backgroundColor: fade(red[500], 0.1),
        margin: `0 7px`,
        "&:hover": {
            backgroundColor: fade(red[500], 0.2),
        },
        "& svg" : {
            width: `1.75em`,
    		height: `1.75em`,
        },
    },
    active: {
        color: `inherit`,
        backgroundColor: `inherit`,
        "&:hover": {
            color: `inherit`,
            backgroundColor: fade(theme.palette.background.default, 0.3),
        },
    },
    locked: {
        opacity: 0.4,
        pointerEvents: `none`,
        backgroundColor: theme.palette.grey[200],
        cursor: `default`,
    },
    disabled: {
        opacity: 0.4,
        pointerEvents: `none`,
        cursor: `default`,
    },
    label: {
        marginTop: 10,
    },
    badgeRoot: {
        position: `absolute`,
        top: 0,
        right: 10,
    },
    badge: {
        background: `#fff`,
        color: `#000`,
        boxShadow: `0px 2px 4px rgba(0,0,0,0.25)`,
    },
    badgeContent: {
        fontSize: `1em`,
    },
}));

interface ToolbarItemMicrophoneProps {
	icon?: any;
	onClick?: any;
	disabled?: boolean;
	active?: boolean;
	locked?: boolean;
	tooltip?: string;
}

function ToolbarItemMicrophone (props: ToolbarItemMicrophoneProps) {
    const {
        icon,
        onClick,
        disabled,
        active,
        locked,
        tooltip = false,
    } = props;
    const classes = useStyles();
    const hasTooltip = tooltip ? true : false;

    return (
        <>
            <Tooltip
                title={tooltip}
                disableFocusListener={!hasTooltip}
                disableHoverListener={!hasTooltip}
                disableTouchListener={!hasTooltip}>
                <div className={classes.itemRoot}>
                    {locked && (
                        <Badge
                            classes={{
                                badge: classes.badge,
                                root: classes.badgeRoot,
                            }}
                            badgeContent={<LockIcon className={classes.badgeContent} />}
                        ></Badge>
                    )}

                    <div
                        className={clsx(classes.root, disabled && classes.disabled, active && classes.active, locked && classes.locked)}
                        onClick={onClick}
                    >
                        {active ? <MicFillIcon /> : <MicDisabledIcon />}
                    </div>
                </div>
            </Tooltip>
        </>
    );
}

export default ToolbarItemMicrophone;
