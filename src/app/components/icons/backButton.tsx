import StyledIcon from "../../../components/styled/icon";
import IconButton from "@material-ui/core/IconButton";
import {
    createStyles,
    makeStyles,
    Theme,
} from "@material-ui/core/styles";
import { ArrowBack as ArrowBackIcon } from "@styled-icons/material/ArrowBack";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        iconButton: {},
    }));

interface Props {
    onClick: () => void;
}

export function BackButton ({ onClick }: Props): JSX.Element {
    const classes = useStyles();
    return (
        <IconButton
            size="medium"
            className={classes.iconButton}
            onClick={onClick}
        >
            <StyledIcon
                icon={<ArrowBackIcon/>}
                size="medium"
                color={`#FFF`}/>
        </IconButton>
    );
}
