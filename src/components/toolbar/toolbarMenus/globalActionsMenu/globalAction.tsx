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
import { StyledIconProps } from "styled-icons/types";

type GlobaActionType = `divider`;
export interface GlobaActionsMenuItem {
    id?: string;
	icon?: StyledIconProps;
	title?: string;
	variant?: string;
	active?: boolean;
	activeIcon?: StyledIconProps;
	onClick?: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(1, 2),
        margin: theme.spacing(0, 0.5),
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
        color: theme.palette.common.white,
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
        backgroundColor: theme.palette.grey[300],
        margin: theme.spacing(0.75, 0.5),
    },
    icon: {
        display: `flex`,
        alignItems: `center`,
    },
}));

export interface Props extends GlobaActionsMenuItem {

}

function GlobalActionsMenuItem (props: Props) {
    const {
        id,
        icon,
        title,
        variant,
        active,
        activeIcon,
        onClick,
    } = props;

    const classes = useStyles();

    return (
        <Tooltip
            title={title ?? ``}
            placement="top"
        >
            <Grid
                item
                id={id}
                className={clsx(classes.root, {
                    [classes.active]: active,
                    [classes.variantBlue]: variant === `blue` && !active,
                    [classes.variantRed]: variant === `red` && !active,
                })}
                onClick={onClick}
            >
                <div className={classes.icon}>
                    {activeIcon ? ( active ? activeIcon : icon ) : icon}
                </div>
            </Grid>
        </Tooltip>
    );
}

export default GlobalActionsMenuItem;
