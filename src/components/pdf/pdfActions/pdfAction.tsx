import { TooltipIntl } from "@/components/tooltip/tooltipIntl";
import { ZoomTypes } from "@/entry-pdfviewer";
import {
    makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React, { useState } from "react";

const ICON_SIZE = 23;
const useStyles = makeStyles((theme) => ({

    button: {
        border: `none`,
        borderRadius: theme.spacing(.5),
        width: ICON_SIZE,
        padding: theme.spacing(.25),
        cursor: `pointer`,
        '&:hover': {
            background: `rgb(255 255 255 / 25%)`,
        },
    },
    disabled: {
        pointerEvents: `none`,
        opacity: 0.2,
    }
}));

interface PdfActionProps {
    title: string;
    onClick?: () => void;
    icon?: string;
    zoomType?:ZoomTypes;
    activeIcon?: string
  }
function PdfAction (props: PdfActionProps) {

    const {
        icon,
        onClick,
        title,
        zoomType,
        activeIcon
    } = props;
    const [ imgIcon, setImgIcon ] = useState(icon);
    const classes = useStyles();
    return (
        <TooltipIntl id={title} >
            <img
                alt={zoomType}
                src={imgIcon}
                className={clsx(classes.button, {
                    [classes.disabled]: !onClick,
                })}
                onMouseDown={() => activeIcon && setImgIcon(activeIcon)}
                onMouseUp={() => activeIcon && setImgIcon(icon)}
                onClick={onClick}
            />
        </TooltipIntl>
    );

}

export { PdfAction };
