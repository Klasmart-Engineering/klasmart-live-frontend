import Button, { ButtonProps } from "@material-ui/core/Button";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

interface Props extends ButtonProps {
    children?: React.ReactNode;
    className?: string;
    isActive: boolean;
}

const useStyles = makeStyles((theme) => createStyles({
    active: {
        "&::after": {
            borderRadius: "0.25rem 0.25rem 0 0",
            borderTop: "0.25rem solid #0E78D5",
            bottom: "0rem",
            content: "' '",
            height: 0,
            left: 0,
            position: "absolute",
            right: 0,
        },
        "&:hover": {
            backgroundColor: "#E8F0FE",
        },
        "color": "#0E78D5",
    },
    root: {
        "&:hover": {
            "-webkit-transition": "all .4s ease",
            "box-shadow": "0 7px 14px rgba(50, 50, 93, 0.1), 0 3px 6px rgba(0, 0, 0, 0.08)",
            "transform": "translateY(-2px)",
            "transition": "all .4s ease",
        },
        "minWidth": theme.spacing(12),
        "padding": theme.spacing(0.5, 2),
        [theme.breakpoints.down("lg")]: {
            minWidth: theme.spacing(8),
        },
        [theme.breakpoints.down("md")]: {
            minWidth: theme.spacing(4),
        },
        [theme.breakpoints.down("sm")]: {
            minWidth: theme.spacing(3),
        },
    },
}),
);

export default function NavButton(props: Props) {
    const classes = useStyles();
    const {children, isActive, ...other } = props;

    return (
        <Button
            className={clsx(classes.root, isActive ? classes.active : "")}
            {...other}
        >
            { children || "class names"}
        </Button>
    );
}
