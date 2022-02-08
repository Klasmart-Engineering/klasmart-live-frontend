import StyledIcon from "@/components/styled/icon";
import {
    createStyles,
    IconButton,
    makeStyles,
} from "@material-ui/core";
import { Close as CloseIcon } from "@styled-icons/material";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({}));

interface Props {
    buttonSize?: `small` | `medium`;
    iconSize?: `small` | `medium` | `large` | `xlarge` | string;
    color?: string;
    onClick: () => void;
}

export default function CloseButton (props: Props) {
    const {
        color,
        buttonSize = `medium`,
        iconSize = `medium`,
        onClick,
    } = props;
    const classes = useStyles();

    return (
        <IconButton
            size={buttonSize}
            onClick={onClick}
        >
            <StyledIcon
                icon={<CloseIcon/>}
                size={iconSize}
                color={color}
            />
        </IconButton>
    );
}
