
import { CanvasToolbarItems } from "./canvasMenu";
import TooltipTipIcon from "@/assets/img/canvas/tooltip-tip.svg";
import { CanvasColor } from "@/utils/canvas.utils";
import {
    makeStyles,
    useTheme,
} from "@material-ui/core";
import clsx from "clsx";
import React from "react";

const COLOR_ITEM_SIZE = 30;

const useStyles = makeStyles((theme) => ({
    root: {
        position: `relative`,
    },
    colorsContainer: {
        display: `grid`,
        gridTemplate: `auto / repeat(6, 1fr)`,
        gridGap: theme.spacing(2),
        background: `white`,
        padding: theme.spacing(2, 3.5),
        borderRadius: 22,
        maxWidth: `300px`,
        border: `1.5px solid rgba(235, 235, 235, 1)`,
    },
    colorItem: {
        width: COLOR_ITEM_SIZE,
        height: COLOR_ITEM_SIZE,
        borderRadius: COLOR_ITEM_SIZE,
        border: `3px solid #D0D0D0`,
        cursor: `pointer`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    tooltipTipIcon: {
        left: 40,
        bottom: `-5px`,
        position: `absolute`,
    },
    tooltipTipPenIcon: {
        left: 40,
    },
    tooltipTipTextIcon: {
        left: 88,
    }
}));

interface Props {
    palette: CanvasColor[];
    activeColor: string;
    onSelectColor: (color: CanvasColor) => void;
    showBottomChevron?: boolean;
    selectedItem?: CanvasToolbarItems;
}

export const CanvasColorSelectorStudy = (props: Props) => {
    const classes = useStyles();
    const {
        palette,
        activeColor,
        onSelectColor,
        selectedItem,
        showBottomChevron = false,
    } = props;

    const theme = useTheme();

    return(
        <div className={classes.root}>
            <div className={classes.colorsContainer}>
                {palette.map(color => (
                    <div key={`color-${color}`} >
                        <div
                            style={{
                                backgroundColor: color,
                                color: activeColor === CanvasColor.WHITE ? theme.palette.getContrastText(activeColor) : theme.palette.common.white,
                                border: activeColor === color ? `2px solid #0576FF` : color === CanvasColor.WHITE ? `1px solid rgba(235, 235, 235, 1)` : `none`,
                            }}
                            className={classes.colorItem}
                            onClick={() => onSelectColor(color)}
                        />
                    </div>
                ))}
            </div>
            {showBottomChevron && (<img
                alt="Chevron Icon"
                src={TooltipTipIcon}
                width={15}
                className={clsx(classes.tooltipTipIcon, {
                    [classes.tooltipTipPenIcon]: selectedItem === CanvasToolbarItems.PENCIL,
                    [classes.tooltipTipTextIcon]: selectedItem === CanvasToolbarItems.TEXT,
                })}
            />)}
        </div>
    );
};
