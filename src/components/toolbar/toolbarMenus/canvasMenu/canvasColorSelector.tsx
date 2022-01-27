
import { CanvasColor } from "./canvasMenu";
import {
    makeStyles,
    useTheme,
} from "@material-ui/core";
import { Check as CheckIcon } from "@styled-icons/bootstrap/Check";
import React from "react";

const COLOR_ITEM_SIZE = 22;

const useStyles = makeStyles((theme) => ({
    colorsContainer: {
        display: `grid`,
        gridTemplate: `auto / repeat(6, 1fr)`,
        gridGap: theme.spacing(1.5),
        padding: theme.spacing(1.5),
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
}));

interface Props {
    palette: CanvasColor[];
    activeColor: string;
    onSelectColor: (color: CanvasColor) => void;
}

export const CanvasColorSelector = (props:Props) => {
    const classes = useStyles();
    const {
        palette,
        activeColor,
        onSelectColor,
    } = props;

    const theme = useTheme();

    return(
        <div className={classes.colorsContainer}>
            {palette.map(color => (
                <div key={`color-${color}`} >
                    <div
                        style={{
                            backgroundColor: color,
                            color: activeColor === CanvasColor.WHITE ? theme.palette.getContrastText(activeColor) : theme.palette.common.white,
                        }}
                        className={classes.colorItem}
                        onClick={() => onSelectColor(color)}
                    >
                        {activeColor === color && <CheckIcon size={22} />}
                    </div>
                </div>
            ))}
        </div>
    );
};
