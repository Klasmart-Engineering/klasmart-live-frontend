import styled from "styled-components"
import { StyledIcon } from "styled-icons/types"
import React from "react";
import { useTheme } from "@material-ui/core/styles";
import Tooltip, { TooltipProps } from "@material-ui/core/Tooltip";

interface Props {
    className?: string;
    color?: string;
    icon: StyledIcon;
    size?: "small" | "medium" | "large" | string;
    tooltip?: TooltipProps;
}

export default function StyledIcon(props: Props) {
    const { className, color, icon, size, tooltip } = props;
    const theme = useTheme();

    const getSize = () => {
        switch(size) {
            case "small":
                return "1rem";
            case "medium":
                return "1.25rem";
            case "large":
                return "1.5rem";
            default:
                if (size) {
                    return size;
                } else { return "1rem"; }
        }
    }


    const BaseIcon = styled(icon)`
        color: ${color ? color : "#000"}
        size: ${() => getSize()};
    `

    return (
        tooltip ?
            <Tooltip 
                aria-label={tooltip["aria-label"]} 
                arrow
                placement={tooltip.placement || "left"}
                title={tooltip.title || ""}
            >
                <BaseIcon />
            </Tooltip> :
            <BaseIcon />
    );
}