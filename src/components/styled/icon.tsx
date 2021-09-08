import {
    Theme,
    useTheme,
} from "@material-ui/core/styles";
import Tooltip,
{ TooltipProps } from "@material-ui/core/Tooltip";
import React,
{
    useEffect,
    useState,
} from "react";
import styled from "styled-components";
import { StyledIcon } from "styled-icons/types";

// How to use props in styled-component: https://styled-components.com/docs/advanced
interface BaseIconProps {
    theme: Theme;
    size: "small" | "medium" | "large" | "xlarge" | string;
    color?: string;
}

const BaseIcon = styled.span`
    color: ${(props: BaseIconProps) => props.color || `#000`};
    width: ${(props: BaseIconProps) => props.size || `1rem`};
    height: ${(props: BaseIconProps) => props.size || `1rem`};
    display: inline-grid;
    &:hover {
        color: ${(props: BaseIconProps) => props.theme.palette.type === `light` ? `#1B365D` : `#FFF`};
        -webkit-transition: all .4s ease;
        transition: all .4s ease;
    }
`;

interface Props {
    className?: string;
    color?: string;
    icon: React.ReactElement;
    size?: "small" | "medium" | "large" | "xlarge" | string;
    tooltip?: TooltipProps;
}

export default function StyledIcon (props: Props) {
    const {
        className,
        color,
        icon,
        size,
        tooltip,
    } = props;
    const theme = useTheme();

    const getSize = () => {
        switch (size) {
        case `small`:
            return `1rem`;
        case `medium`:
            return `1.25rem`;
        case `large`:
            return `1.5rem`;
        case `xlarge`:
            return `2rem`;
        default:
            if (size) {
                return size;
            } else { return `1rem`; }
        }
    };

    const [ determinedSize, setDeterminedSize ] = useState(`1rem`);
    useEffect(() => {
        const size = getSize();
        setDeterminedSize(size);
    }, []);

    return (tooltip ? (
        <Tooltip
            arrow
            aria-label={tooltip[`aria-label`]}
            placement={tooltip.placement || `left`}
            title={tooltip.title || ``}
        >
            <BaseIcon
                theme={theme}
                color={color}
                size={determinedSize}>
                {icon}
            </BaseIcon>
        </Tooltip>
    ) : (
        <BaseIcon
            theme={theme}
            color={color}
            size={determinedSize}>
            {icon}
        </BaseIcon>
    )
    );
}
