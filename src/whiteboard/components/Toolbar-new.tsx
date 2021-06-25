// This is temporary and will be removed after the App and Web merge.

import React, { FunctionComponent, ReactChild, ReactChildren, useCallback, useContext, useState, useEffect } from "react";
import useTheme from "@material-ui/core/styles/useTheme";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { blue, cyan, green, orange, red, yellow, pink, purple, brown } from '@material-ui/core/colors';
import Grid from "@material-ui/core/Grid/Grid";
import IconButton from "@material-ui/core/IconButton";

import { Move as MoveIcon } from "@styled-icons/boxicons-regular/Move";
import { Brush as BrushIcon } from "@styled-icons/material/Brush";
import { TextFields as TextIcon } from "@styled-icons/material/TextFields";
import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";
import { Trash as TrashIcon } from "@styled-icons/boxicons-solid/Trash";

import { useToolbarContext } from "kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";
import { useSynchronizedState } from "../context-providers/SynchronizedStateProvider";

import BlackCrayon from "../../assets/img/canvas/crayons/black.svg";
import WhiteCrayon from "../../assets/img/canvas/crayons/white.svg";
import GrayCrayon from "../../assets/img/canvas/crayons/gray.svg";
import BlueCrayon from "../../assets/img/canvas/crayons/blue.svg";
import GreenCrayon from "../../assets/img/canvas/crayons/green.svg";
import YellowCrayon from "../../assets/img/canvas/crayons/yellow.svg";
import OrangeCrayon from "../../assets/img/canvas/crayons/orange.svg";
import RedCrayon from "../../assets/img/canvas/crayons/red.svg";
import PinkCrayon from "../../assets/img/canvas/crayons/pink.svg";
import PurpleCrayon from "../../assets/img/canvas/crayons/purple.svg";
import BrownCrayon from "../../assets/img/canvas/crayons/brown.svg";
import Eraser from "../../assets/img/canvas/eraser.svg";

import { ClassType } from "../../store/actions";
import { useSessionContext } from "../../context-provider/session-context";

const WhiteboardColors = [
    { color: "#000000", crayon: BlackCrayon }, // black
    { color: "#ffffff", crayon: WhiteCrayon }, // white
    { color: "#9c9ca5", crayon: GrayCrayon }, // gray
    { color: "#824949", crayon: BrownCrayon }, // brown
    { color: "#fbe739", crayon: YellowCrayon }, // yellow
    { color: "#ffa500", crayon: OrangeCrayon }, // orange
    { color: "#ffc0cb", crayon: PinkCrayon }, // pink
    { color: "#ff0000", crayon: RedCrayon }, // red
    { color: "#00ff00", crayon: GreenCrayon }, // green
    { color: "#0000ff", crayon: BlueCrayon }, // blue
    { color: "#800080", crayon: PurpleCrayon }, // purple
];

type Props = {
    children?: ReactChild | ReactChildren | null | any;
    useLocalDisplay?: boolean
}

export const WBToolbar: FunctionComponent<Props> = ({ children, useLocalDisplay }: Props): JSX.Element => {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

    const { state: { display, localDisplay, permissions } } = useSynchronizedState();
    const { state: { tools }, actions: { selectTool, selectColorByValue, clear } } = useToolbarContext();

    const [ selectedColorIndex, setSelectedColorIndex ] = useState<number>(0);

    const { classType: classtype, isTeacher, sessionId } = useSessionContext();
    const [activedTool, setActivedTool] = useState({ move: false, line: false, text: false, erase: false, clear: false });
    const forStudent = classtype === ClassType.STUDY || !isTeacher;

    useEffect(() => {
        selectLine();
        setSelectedColorIndex(0);
    }, []);

    useEffect(() => {
        if (selectedColorIndex < 0) {
            return;
        }

        selectColorByValue(WhiteboardColors[selectedColorIndex].color);
        setActivedTool({ move: false, line: activedTool.line, text: false, erase: false, clear: false });
    }, [selectedColorIndex]);

    const selectLine = () => { selectTool("line"); setActivedTool({ move: false, line: true, text: false, erase: false, clear: false }); }
    const selectText = () => { selectTool("text"); setActivedTool({ move: false, line: false, text: true, erase: false, clear: false }); setSelectedColorIndex(-1); }
    const selectMove = () => { selectTool("move"); setActivedTool({ move: true, line: false, text: false, erase: false, clear: false }); setSelectedColorIndex(-1); }

    const selectObjectEraser = useCallback(() => {
        const eraserOptions = tools.eraser.options;
        if (eraserOptions) {
            selectTool("eraser", eraserOptions[0]);
        }
        setActivedTool({ move: false, line: false, text: false, erase: true, clear: false });
        setSelectedColorIndex(-1);
    }, [selectTool, tools.eraser.options]);
    const selectClear = () => { clear([sessionId]); setActivedTool({ move: false, line: false, text: false, erase: false, clear: true }); setSelectedColorIndex(-1); }

    type ColorButtonOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    const ColorButton = ({ actived, onClick, colorValue, crayon }: {
        actived: boolean,
        onClick: ColorButtonOnClick,
        colorValue: string,
        crayon?: string
    }) => (
            <Grid item style={{ flex: 1, textAlign: "center" }}>
                <IconButton
                    style={{
                        width: "3rem",
                        height: "3rem",
                        backgroundColor: crayon ? "transparent" : colorValue,
                        border: actived ? `${isSmDown ? 2 : 5}px solid ${"#1B365D"}` : 0
                    }} // TODO: Handle when Dark mode
                    onClick={isTeacher ? onClick : (e) => {
                        onClick(e);
                        selectTool("line");
                    }}
                >
                    {crayon ? <img alt={`crayon ${colorValue}`} src={crayon} height={32} /> : null}
                </IconButton>
            </Grid>
        );

    const ColorPicker = () => (<>
        { WhiteboardColors.map((c, i) => {
            return <ColorButton actived={i === selectedColorIndex} onClick={() => setSelectedColorIndex(i)} colorValue={c.color} crayon={forStudent ? c.crayon : undefined} />
        })}
    </>)

    type ToolButtonOnClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    const ToolButton = ({ children, clicked, actived }: { children: ReactChild, clicked: ToolButtonOnClick, actived: boolean }) => (
        <Grid item style={{ flex: 0, textAlign: "center" }}>
            <IconButton
                color="primary"
                size={isSmDown ? "small" : "medium"}
                onClick={clicked}
                style={{
                    width: "3rem",
                    height: "3rem",
                    color: actived ? "white" : undefined,
                    backgroundColor: forStudent ? "transparent" : (actived ? "#1B365D" : "#f6fafe"),
                    border: (forStudent && actived) ? `${isSmDown ? 2 : 5}px solid ${"#1B365D"}` : 0
                }}
            >
                {children}
            </IconButton>
        </Grid>
    );

    const VisibleToolbar = () => (forStudent ? (
        <Grid id="wb-toolbar-student" container direction="row" justify="center" alignItems="center" spacing={2} item style={{ flex: 1 }}>
            <Grid container direction="row" justify="space-between" alignItems="center" alignContent="center" item style={{ flex: 1, padding: 0, height: "100%" }}>
                <ColorPicker />
            </Grid>
            <Grid item style={{ flex: 0 }}>
                <ToolButton clicked={selectObjectEraser} actived={activedTool.erase}><img alt={`eraser`} src={Eraser} height={32} /></ToolButton>
            </Grid>
            {children}
        </Grid>
    ) : (
            <Grid id="wb-toolbar-teacher" container direction="row" justify="space-between" alignItems="center" spacing={2} item style={{ flex: 1 }}>
                <Grid container direction="row" justify="space-between" alignItems="center" alignContent="center" item style={{ flex: 1 }}>
                    <ColorPicker />
                </Grid>
                <Grid container direction="row" justify="space-between" alignItems="center" alignContent="center" item style={{ flex: 0 }}>
                    <ToolButton clicked={selectLine} actived={activedTool.line}><BrushIcon size={"1.5rem"} /></ToolButton>
                    <ToolButton clicked={selectText} actived={activedTool.text}><TextIcon size={"1.5rem"} /></ToolButton>
                    <ToolButton clicked={selectMove} actived={activedTool.move}><MoveIcon size={"1.5rem"} /></ToolButton>
                    <ToolButton clicked={selectObjectEraser} actived={activedTool.erase}><EraserIcon size={"1.5rem"} /></ToolButton>
                    <ToolButton clicked={selectClear} actived={activedTool.clear}><TrashIcon size={"1.5rem"} /></ToolButton>
                </Grid>
                {children}
            </Grid>
        ));

    if (classtype === ClassType.LIVE) {
        return display && permissions.allowCreateShapes ? <VisibleToolbar /> : <></>
    } else {
        return <VisibleToolbar />
    }
}

export default WBToolbar;