import StyledIcon from "./styled/icon";
import {Close as CloseIcon} from "@styled-icons/material/Close";
import IconButton from "@material-ui/core/IconButton";
import React from "react";
import {createStyles, makeStyles, Theme} from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        iconButton: {
            backgroundColor: theme.palette.background.paper
        },
    }),
);

interface Props {
    onClick: () => void
}

export function CloseIconButton({onClick}: Props): JSX.Element {
    const classes = useStyles();
    return (
        <IconButton
            onClick={onClick}
            size="medium"
            className={classes.iconButton}
        >
            <StyledIcon icon={<CloseIcon/>} size="medium" color={"#3676CE"}/>
        </IconButton>
    )
}
