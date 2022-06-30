import { THEME_COLOR_LIGHT_BLACK_TEXT } from "@/config";
import {
    ButtonBase,
    createStyles,
    makeStyles,
    Typography,
} from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    root: {
        flexDirection: `column`,
        alignItems: `flex-start`,
        justifyContent: `flex-start`,
        height: `100%`,
        width: `100%`,
        borderRadius: theme.spacing(2.5, 2.5, 2.5, 6.75),
        padding: theme.spacing(1.5, 2.5, 0),
        [theme.breakpoints.up(`md`)]: {
            padding: theme.spacing(4.5),
        },
    },
    title: {
        color: THEME_COLOR_LIGHT_BLACK_TEXT,
        fontWeight: theme.typography.fontWeightBold as number,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `2.5rem`,
        },
    },
    description: {
        color: THEME_COLOR_LIGHT_BLACK_TEXT,
        fontWeight: theme.typography.fontWeightMedium as number,
        fontSize: `0.85rem`,
        [theme.breakpoints.up(`md`)]: {
            fontSize: `1.2rem`,
        },
    },
}));

export interface Props {
    title: string;
    description: string;
    backgroundColor: string;
    image: string;
    onClick?: () => void;
}

export default function CategoryItem (props: Props) {
    const {
        title,
        description,
        backgroundColor,
        image,
        onClick,
    } = props;
    const classes = useStyles();

    return (
        <ButtonBase
            className={classes.root}
            style={{
                background: `${backgroundColor} url(${image}) bottom center/95% no-repeat`,
            }}
            onClick={onClick}
        >
            <Typography
                variant={`h6`}
                className={classes.title}
            >
                {title}
            </Typography>
            <Typography
                variant={`body1`}
                className={classes.description}
            >
                {description}
            </Typography>
        </ButtonBase>

    );
}
