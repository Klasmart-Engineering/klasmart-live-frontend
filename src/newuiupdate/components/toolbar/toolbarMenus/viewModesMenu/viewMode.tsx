import {
    Grid,
    makeStyles,
    Theme,
    Typography,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";

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
}));

interface ViewModeProps {
	active: any;
	onClick: any;
	icon: any;
	title: any;
    disabled?: boolean;
}

function ViewMode (props: ViewModeProps) {
    const {
        active,
        onClick,
        icon,
        title,
        disabled,
    } = props;

    const classes = useStyles();

    return (
        <Grid item>
            <Grid
                container
                direction="column"
                alignItems="center"
                className={clsx(classes.item, {
                    [classes.active]: active,
                    [classes.disabled]: disabled,
                })}
                onClick={onClick}>
                <Grid item>
                    <div className={classes.itemIcon}>{icon}</div>
                </Grid>
                <Grid item>
                    <Typography>{title}</Typography>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ViewMode;
