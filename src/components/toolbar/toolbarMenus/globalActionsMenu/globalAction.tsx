import {
    Grid,
    makeStyles,
    Theme,
    Tooltip,
} from "@material-ui/core";
import amber from "@material-ui/core/colors/amber";
import red from "@material-ui/core/colors/red";
import clsx from "clsx";
import React from "react";

interface GlobaActionsMenuProps {
	type?: any;
	icon?: any;
	title?: any;
	variant?: any;
	active?: any;
	activeIcon?: any;
	onClick?: any;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: `8px 16px`,
        margin: `0 4px`,
        cursor: `pointer`,
        borderRadius: 10,
        display: `flex`,
        color: amber[500],
        filter: `drop-shadow( 1px 3px 2px rgba(255, 193,20, .2))`,
        transition: `100ms all ease-in-out`,
        "&:hover": {
            backgroundColor: theme.palette.grey[200],
            filter: `none`,
        },
    },
    active: {
        backgroundColor: theme.palette.text.primary,
        filter: `none`,
        color: `#fff`,
        "&:hover": {
            backgroundColor: theme.palette.text.primary,
        },
    },
    variantBlue:{
        color: theme.palette.text.primary,
        filter: `drop-shadow( 1px 3px 2px rgba(82, 128, 191, .2))`,
    },
    variantRed:{
        color: red[500],
        filter: `drop-shadow( 1px 3px 2px rgba(255, 116, 106, .2))`,
    },
    divider: {
        width: 1,
        backgroundColor: theme.palette.grey[200],
        margin: `0 4px`,
    },
    icon: {
        display: `flex`,
        alignItems: `center`,
    },
}));

function GlobalActionsMenuItem (props: GlobaActionsMenuProps) {
    const {
        type,
        icon,
        title,
        variant,
        active,
        activeIcon,
        onClick,

    } = props;

    const classes = useStyles();

    if (type === `divider`) return <Grid
        item
        className={classes.divider}></Grid>;

    return (
        <Tooltip
            title={title}
            placement="top">
            <Grid
                item
                className={clsx(classes.root, {
                    [classes.active]:  active,
                    [classes.variantBlue]:  variant === `blue` && !active,
                    [classes.variantRed]:  variant === `red` && !active,
                })}
                onClick={onClick}
            >
                <div className={classes.icon}>
                    {activeIcon ? active ? activeIcon : icon: icon}
                </div>
            </Grid>
        </Tooltip>
    );
}

export default GlobalActionsMenuItem;
