import { activeTabState } from "@/store/layoutAtoms";
import {
    Badge,
    makeStyles,
    Theme,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import amber from "@material-ui/core/colors/amber";
import clsx from "clsx";
import React from "react";
import { useRecoilValue } from "recoil";
import { StyledIcon } from "styled-icons/types";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        borderRadius: 12,
        cursor: `pointer`,
        padding: `0.9em`,
        margin: `0 0.1em`,
        transition: `all 100ms ease-in-out`,
        position: `relative`,
        "&:hover": {
            backgroundColor: theme.palette.grey[200],
        },
        "& > svg":{
            height: `1.5em`,
        },
    },
    rootMosaic:{
        "&:hover": {
            backgroundColor: `rgba(255, 255, 255, 0.15)`,
        },
        "&$active":{
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.background.paper,
            "&:hover": {
                backgroundColor: theme.palette.background.paper,
            },
        },
    },
    rootMd:{},
    active: {
        backgroundColor: theme.palette.background.default,
        "&:hover": {
            backgroundColor: theme.palette.background.default,
        },
    },
    disabled: {
        opacity: 0.4,
        pointerEvents: `none`,
        cursor: `default`,
    },
    label: {
        marginTop: 10,
        fontSize: `0.8em`,
    },
    labelMd:{
        display: `none`,
    },
    badgeRoot: {
        position: `absolute`,
        top: 12,
        right: 12,
    },
    badge: {
        width: 22,
        height: 22,
        borderRadius: 20,
        color: theme.palette.text.primary,
        backgroundColor: amber[500],
        boxShadow: `0px 2px 4px rgba(0,0,0,0.25)`,
        padding: 0,
        zIndex: 1200,
        fontSize: `0.8em`,
        "& svg":{
            height: 15,
            width: 15,
        },
    },
    badgeContent: {
        fontSize: `1em`,
    },
}));

interface ToolbarItemProps {
	display?: boolean;
	ref?: React.MutableRefObject<HTMLDivElement>;
	icon?: any;
	label?: string;
	onClick?: (event:React.MouseEvent<HTMLElement>) => void;
	disabled?: boolean;
	active?: boolean;
	badge?: any;
	tooltip?: string;
}

function ToolbarItem (props: ToolbarItemProps) {
    const {
        display = false,
        icon,
        label,
        onClick,
        disabled,
        active,
        badge,
        tooltip = ``,
    } = props;
    const classes = useStyles();
    const activeTab = useRecoilValue(activeTabState);

    const theme = useTheme();
    const isMdDown = useMediaQuery(theme.breakpoints.down(`md`));

    if(!display){
        return(null);
    }

    return (
        <>
            <Tooltip title={tooltip}>
                <div
                    className={clsx(classes.root, {
                        [classes.rootMosaic] : activeTab === `mosaic`,
                        [classes.rootMd] : isMdDown,
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
                    {label && <Typography className={clsx(classes.label, {
                        [classes.labelMd] : isMdDown,
                    })}>{label}</Typography>}
                </div>
            </Tooltip>
        </>
    );
}

export default ToolbarItem;
