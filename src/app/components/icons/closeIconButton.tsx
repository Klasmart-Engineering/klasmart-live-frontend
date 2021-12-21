import StyledIcon from "../../../components/styled/icon";
import {
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_SECONDARY_DEFAULT,
} from "@/config";
import IconButton from "@material-ui/core/IconButton";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import React from "react";

interface Props {
    buttonSize?: `small` | `medium`;
    iconSize?: `small` | `medium` | `large` | `xlarge` | string;
    color?: string;
    backgroundColor?: string;
    onClick: () => void;
}

export function CloseIconButton ({
    buttonSize = `medium`,
    iconSize = `medium`,
    color = THEME_COLOR_SECONDARY_DEFAULT,
    backgroundColor = THEME_COLOR_BACKGROUND_PAPER,
    onClick,
}: Props): JSX.Element {
    return (
        <IconButton
            size={buttonSize}
            style={{
                backgroundColor: backgroundColor,
            }}
            onClick={onClick}
        >
            <StyledIcon
                icon={<CloseIcon/>}
                size={iconSize}
                color={color}/>
        </IconButton>
    );
}
