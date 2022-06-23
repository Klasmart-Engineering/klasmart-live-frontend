import { makeStyles, Theme, Typography } from "@material-ui/core";
import React from "react";
import { ReactElement } from "react";

const useStyles = makeStyles((theme: Theme) => ({
    root:{
        display: `flex`,
        justifyContent: `center`,
        alignItems: `center`,
        height: `100%`,
    },
    inner:{
        display: `flex`,
        flexDirection: `column`,
        alignItems: `center`,
        textAlign: `center`,
    },
    icon:{
        marginBottom: 10,
        "& svg":{
            height: `4rem`,
            width: `4rem`,
            opacity: 0.1,
        },
    },
    text:{
        color: theme.palette.grey[700],
    },
}));

interface Props {
	icon?: any;
	text?: ReactElement | string;
}

function NoItemList (props: Props) {
    const classes = useStyles();
    const {
        icon,
        text,
    } = props;

    return (
        <div className={classes.root}>
            <div className={classes.inner}>
                <div className={classes.icon}>{icon}</div>
                <Typography className={classes.text}>{text}</Typography>
            </div>
        </div>
    );
}

export { NoItemList };