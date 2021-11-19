import StyledIcon from "@/components/styled/icon";
import {
    createStyles,
    IconButton,
    makeStyles,
} from "@material-ui/core";
import { ArrowBack as ArrowBackIcon } from "@styled-icons/material";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
    onClick: () => any | Promise<any>;
}

export default function BackButton (props: Props) {
    const { onClick } = props;
    const classes = useStyles();

    return (
        <IconButton
            size="medium"
            onClick={onClick}
        >
            <StyledIcon
                icon={<ArrowBackIcon />}
                size="medium"
            />
        </IconButton >
    );
}
