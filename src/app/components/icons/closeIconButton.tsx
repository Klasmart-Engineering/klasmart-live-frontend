import StyledIcon from "../../../components/styled/icon";
import IconButton from "@material-ui/core/IconButton";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        iconButton: {
            backgroundColor: theme.palette.background.paper,
        },
    }));

interface Props {
    onClick: () => void;
}

export function CloseIconButton ({ onClick }: Props): JSX.Element {
    const classes = useStyles();
    return (
        <IconButton
            size="medium"
            className={classes.iconButton}
            onClick={onClick}
        >
            <StyledIcon
                icon={<CloseIcon/>}
                size="medium"
                color={`#3676CE`}/>
        </IconButton>
    );
}
