import { PdfAction } from "./pdfAction";
import FitToHeightIcon from "@/assets/img/pdf/fit-to-height.svg";
import FitToWidthIcon from "@/assets/img/pdf/fit-to-width.svg";
import ZoomInIcon from "@/assets/img/pdf/zoom-in.svg";
import ZoomInFilledIcon from "@/assets/img/pdf/zoom-in-filled.svg";
import ZoomOutIcon from "@/assets/img/pdf/zoom-out.svg";
import ZoomOutFilledIcon from "@/assets/img/pdf/zoom-out-filled.svg";
import { ZoomTypes } from "@/entry-pdfviewer";
import {
    Box,
    makeStyles,
} from "@material-ui/core";
import React from "react";

interface PdfActionsProps {
    actionHandler: (type: ZoomTypes) => void;
    disabledActions?: ZoomTypes[];
  }

const useStyles = makeStyles((theme) => ({

    zoomIcons: {
        background: `rgb(0 0 0 / 65%)`,
        borderRadius: theme.spacing(1),
        padding: theme.spacing(0.80, 1),
        color: theme.palette.common.white,
        display: `flex`,
        alignItems: `center`,
    },
}));
function PdfActions (props: PdfActionsProps) {

    const classes = useStyles();
    const {
        actionHandler,
        disabledActions,
    } = props;
    const pdfActionsArray = [
        {
            zoomType: ZoomTypes.ZOOM_OUT,
            title: `tooltip.zoomOut`,
            onClick: () => actionHandler(ZoomTypes.ZOOM_OUT),
            icon: ZoomOutIcon,
            activeIcon: ZoomOutFilledIcon
        },
        {
            zoomType: ZoomTypes.ZOOM_IN,
            title: `tooltip.zoomIn`,
            onClick: () => actionHandler(ZoomTypes.ZOOM_IN),
            icon: ZoomInIcon,
            activeIcon: ZoomInFilledIcon
        },
        {
            zoomType: ZoomTypes.WIDTH_FIT,
            title: `tooltip.fitToWidth`,
            onClick: () => actionHandler(ZoomTypes.WIDTH_FIT),
            icon: FitToWidthIcon,
            activeIcon: undefined
        },
        {
            zoomType: ZoomTypes.HEIGHT_FIT,
            title: `tooltip.fitToHeight`,
            onClick: () => actionHandler(ZoomTypes.HEIGHT_FIT),
            icon: FitToHeightIcon,
            activeIcon: undefined
        },
    ];

    return (
        <Box className={classes.zoomIcons}>
            {pdfActionsArray.map(pdfAction => {
                const {
                    title,
                    onClick,
                    zoomType,
                    activeIcon,
                    icon
                } = pdfAction;

                return (
                    <PdfAction
                        key={zoomType}
                        zoomType={zoomType}
                        title={title}
                        icon={icon}
                        activeIcon={activeIcon}
                        onClick={!disabledActions?.includes(zoomType) ? onClick : undefined}
                    />
                );

            })
            }

        </Box>
    );
}
export { PdfActions };
