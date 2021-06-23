import React, { FunctionComponent, ReactChild, ReactChildren, useCallback, useContext } from "react";
import { useSynchronizedState } from "../context-providers/SynchronizedStateProvider";
import Grid from "@material-ui/core/Grid/Grid";
import useTheme from "@material-ui/core/styles/useTheme";
import { useToolbarContext } from "kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";
import { IconButton } from "@material-ui/core";
import { Move as MoveIcon } from "@styled-icons/boxicons-regular/Move";
import { Brush as BrushIcon } from "@styled-icons/material/Brush";
import { TextFields as TextIcon } from "@styled-icons/material/TextFields";
import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";
import { Trash as TrashIcon } from "@styled-icons/boxicons-solid/Trash";
import { useSessionContext } from "../../context-provider/session-context";

type Props = {
    children?: ReactChild | ReactChildren | null | any;
}

const WhiteboardColors = [
    "#000000", // black
    "#ffffff", // white
    "#9c9ca5", // gray
    "#824949", // brown
    "#fbe739", // yellow
    "#ffa500", // orange
    "#ffc0cb", // pink
    "#ff0000", // red
    "#00ff00", // green
    "#0000ff", // blue
    "#800080", // purble
];

export const Toolbar: FunctionComponent<Props> = ({ children }: Props): JSX.Element => {
    const {
        state: { display, permissions },
    } = useSynchronizedState();

    const {
        state: { tools }, actions: { selectTool, selectColorByValue, clear }
    } = useToolbarContext();

    const { sessionId } = useSessionContext();

    const theme = useTheme();

    const selectObjectEraser = useCallback(() => {
        const eraserOptions = tools.eraser.options;
        if (eraserOptions) {
            selectTool("eraser", eraserOptions[0]);
        }
    }, [selectTool, tools.eraser.options]);

    const ColorButton = ({ colorValue }: { colorValue: string }) => (
        <Grid container item xs={2} md={2} style={{ textAlign: "center" }}>
            <Grid item xs={6}>
                <IconButton
                    color={"primary"}
                    style={{ backgroundColor: colorValue, border: "1px solid black" }}
                    onClick={() => { selectColorByValue(colorValue); }}
                >
                </IconButton>
            </Grid>
        </Grid>
    );

    type ToolButtonOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;

    const ToolButton = ({ children, clicked }: { children: any, clicked: ToolButtonOnClick }) => (
        <Grid container item xs={2} md={2} style={{ textAlign: "center" }}>
            <Grid item xs={6}>
                <IconButton
                    color={"primary"}
                    style={{ backgroundColor: "#f6fafe" }}
                    onClick={clicked}
                >
                    {children}
                </IconButton>
            </Grid>
        </Grid>
    );

    const VisibleToolbar = () => (
        <div id={"toolbar"}>
            <Grid container direction="row" justify="center" alignItems="center" spacing={1} style={{ flexGrow: 0, padding: theme.spacing(2) }}>
                <ToolButton clicked={() => selectTool("move")}><MoveIcon size="1.5rem" /></ToolButton>
                <ToolButton clicked={() => selectTool("line")}><BrushIcon size="1.5rem" /></ToolButton>
                <ToolButton clicked={() => selectTool("text")}><TextIcon size="1.5rem" /></ToolButton>
                <ToolButton clicked={() => selectObjectEraser()}><EraserIcon size="1.5rem" /></ToolButton>
                <ToolButton clicked={() => clear([sessionId])}><TrashIcon size="1.5rem" /></ToolButton>
            </Grid>
            <Grid container direction="row" justify="center" alignItems="center" spacing={1} style={{ flexGrow: 0, padding: theme.spacing(2) }}>
                { WhiteboardColors.map(c => { return <ColorButton colorValue={c} /> })}
            </Grid>
            {children}
        </div>
    );

    return display && permissions.allowCreateShapes ? <VisibleToolbar /> : <></>
}

export default Toolbar;