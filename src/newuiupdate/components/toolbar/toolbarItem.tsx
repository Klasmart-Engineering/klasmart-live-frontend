import { activeTabState } from "../../states/layoutAtoms";
import {
    Badge,
    makeStyles,
    Theme,
    Tooltip,
    Typography,
} from "@material-ui/core";
import amber from "@material-ui/core/colors/amber";
import clsx from "clsx";
import React from "react";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        borderRadius: 12,
        cursor: `pointer`,
        padding: 15,
        margin: `0 4px`,
        transition: `all 100ms ease-in-out`,
        position: `relative`,
        "&:hover": {
            backgroundColor: `#e2e7ec`,
        },
        "& > svg":{
            height: 25,
        },
    },
    rootMosaic:{
        "&:hover": {
            backgroundColor: `rgba(60, 70, 80, 0.5)`,
        },
    },
    active: {
        backgroundColor: `#B4CDED`,
        "&:hover": {
            backgroundColor: `#B4CDED`,
        },
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
        top: 6,
        right: 6,
    },
    badge: {
        width: 26,
        height: 26,
        borderRadius: 20,
        color: theme.palette.text.primary,
        backgroundColor: amber[500],
        boxShadow: `0px 2px 4px rgba(0,0,0,0.25)`,
        padding: 0,
        zIndex: 1200,
        fontSize: `0.8em`,
        "& svg":{
            height: 16,
            width: 16,
        },
    },
    badgeContent: {
        fontSize: `1em`,
    },
}));

interface ToolbarItemProps {
	icon?: any;
	label?: string;
	onClick?: any;
	disabled?: boolean;
	active?: boolean;
	badge?: any;
	tooltip?: string | boolean;
}

function ToolbarItem (props: ToolbarItemProps) {
    const {
        icon,
        label,
        onClick,
        disabled,
        active,
        badge,
        tooltip = false,
    } = props;
    const classes = useStyles();
    const hasTooltip = tooltip ? true : false;
    const [ activeTab, setActiveTab ] = useRecoilState(activeTabState);

    return (
        <>
            <Tooltip
                title={tooltip}
                disableFocusListener={!hasTooltip}
                disableHoverListener={!hasTooltip}
                disableTouchListener={!hasTooltip}>
                <div>
                    <div
                        className={clsx(classes.root, {
                            [classes.rootMosaic] : activeTab === `mosaic`,
                            [classes.active] : active,
                            [classes.disabled] : disabled,
                        })}
                        onClick={onClick}
                    >
                        {badge && (
                            <Badge
                                classes={{
                                    badge: classes.badge,
                                    root: classes.badgeRoot,
                                }}
                                badgeContent={<div className={classes.badgeContent}>{badge}</div>}
                            />
                        )}
                        {icon}
                        {label && <Typography className={classes.label}>{label}</Typography>}
                    </div>
                </div>
            </Tooltip>
        </>
    );
}

export default ToolbarItem;
