import LockIcon from "@mui/icons-material/Lock";
import {
    alpha,
    Badge,
    Theme,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import { red } from '@mui/material/colors';
import makeStyles from '@mui/styles/makeStyles';
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme: Theme) => ({
    itemRoot: {
        position: `relative`,
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        padding: `0.9em`,
        borderRadius: 12,
        cursor: `pointer`,
        "&:hover": {
            backgroundColor: alpha(theme.palette.background.default, 0.3),
        },
    },
    itemRootMd: {
        padding: `0.1em`,
        "& $leaveTitle": {
            fontWeight: theme.typography.fontWeightMedium as number,
        },
    },
    root: {
        width: 34,
        height: 34,
        position: `relative`,
        top: -5,
        justifyContent: `center`,
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        color: `#fff`,
        backgroundColor: red[500],
        boxShadow: `0 3px 6px #fe434361`,
        borderRadius: 50,
        cursor: `pointer`,
        transition: `all 100ms ease-in-out`,
        "&:hover": {
            transform: `scale(1.1)`,
        },
        "& svg": {
            width: `1.25em`,
            height: `1.25em`,
        },
    },
    disabled: {
        opacity: 0.4,
        pointerEvents: `none`,
        cursor: `default`,
    },
    locked: {},
    active: {},
    badgeRoot: {
        position: `absolute`,
        right: 18,
    },
    badge: {
        background: `#fff`,
        color: `#000`,
        boxShadow: `0px 2px 4px rgba(0,0,0,0.25)`,
    },
    badgeContent: {
        fontSize: `1em`,
    },
    leaveTitle: {
        fontSize: `0.8em`,
    },
}));

interface ToolbarItemCallProps {
    id?: string;
	src?: string | undefined;
	onClick?: any;
    disabled?: boolean;
    isHost?: boolean;
	active?: boolean;
	locked?: boolean;
	tooltip?: string;
}

function ToolbarItemCall (props: ToolbarItemCallProps) {
    const {
        id,
        src,
        onClick,
        disabled,
        active,
        locked,
        tooltip = ``,
        isHost = false,
    } = props;
    const classes = useStyles();
    const theme = useTheme();
    const isLgDown = useMediaQuery(theme.breakpoints.down(`lg`));

    return (
        <>
            <Tooltip title={tooltip}>
                <div
                    id={id}
                    role="button"
                    className={clsx(classes.itemRoot, {
                        [classes.itemRootMd]: isLgDown,
                    })}
                    onClick={onClick}
                >
                    {locked && (
                        <Badge
                            classes={{
                                badge: classes.badge,
                                root: classes.badgeRoot,
                            }}
                            badgeContent={<LockIcon className={classes.badgeContent} />}
                        />
                    )}
                    <div
                        className={clsx(classes.root, disabled && classes.disabled, active && classes.active, locked && classes.locked)}
                    >
                        <img
                            alt="Leave class icon"
                            src={src}
                            width={19}
                            height={20}
                        />
                    </div>
                    <Typography
                        align="center"
                        className={classes.leaveTitle}
                    >
                        <FormattedMessage id={isHost ? `end_class` : `leave_class`} />
                    </Typography>
                </div>
            </Tooltip>
        </>
    );
}

export default ToolbarItemCall;
