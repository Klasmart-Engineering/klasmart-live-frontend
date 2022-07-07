import { THEME_COLOR_ORG_MENU_DRAWER } from "@/config";
import {
    Button,
    darken,
    makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";
import { FormattedMessage } from "react-intl";

const useStyles = makeStyles((theme) => ({
    button: {
        borderRadius: theme.spacing(5),
        padding: theme.spacing(1, 4),
        margin: theme.spacing(0, 2),
        fontSize: `1.15em`,
        color: theme.palette.common.white,
        backgroundColor: THEME_COLOR_ORG_MENU_DRAWER,
        boxShadow: `none !important`,
        border: `2px solid ${THEME_COLOR_ORG_MENU_DRAWER}`,
        minWidth: 190,
    },
    buttonOutlined: {
        color: THEME_COLOR_ORG_MENU_DRAWER,
        backgroundColor: `transparent`,
    },
    buttonContained: {
        "&:hover": {
            backgroundColor: `${darken(THEME_COLOR_ORG_MENU_DRAWER, 0.4)}  !important`,
        },
    },
}));

export enum Variant { TEXT = `text`, OUTLINED = `outlined`, CONTAINED = `contained`}

export interface Props {
  onClick: () => void;
  icon: string;
  title: string;
  variant?: Variant;
}

export default function RoundButton (props: Props){
    const classes = useStyles();
    const {
        onClick,
        icon,
        title,
        variant = Variant.CONTAINED,
    } = props;

    return (
        <Button
            startIcon={(
                <img
                    src={icon}
                    width={20}
                    alt="icon"
                />
            )}
            variant={variant}
            className={clsx(classes.button, {
                [classes.buttonOutlined]: variant === Variant.OUTLINED,
                [classes.buttonContained]: variant === Variant.CONTAINED,
            })}
            onClick={onClick}
        >
            <FormattedMessage id={title} />
        </Button>
    );
}
