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
import BlueCrayon from "../../assets/img/canvas/crayons/blue.svg";
import QingseCrayon from "../../assets/img/canvas/crayons/qingse.svg";
import GreenCrayon from "../../assets/img/canvas/crayons/green.svg";
import YellowCrayon from "../../assets/img/canvas/crayons/yellow.svg";
import OrangeCrayon from "../../assets/img/canvas/crayons/orange.svg";
import RedCrayon from "../../assets/img/canvas/crayons/red.svg";
import PinkCrayon from "../../assets/img/canvas/crayons/pink.svg";
import PurpleCrayon from "../../assets/img/canvas/crayons/purple.svg";
import BrownCrayon from "../../assets/img/canvas/crayons/brown.svg";
import Eraser from "../../assets/img/canvas/eraser.svg";
import { ClassType } from "../../store/actions";
import { LocalSessionContext } from "../../entry";

type Props = {
    children?: ReactChild | ReactChildren | null | any;
}

export const WBToolbar: FunctionComponent<Props> = ({ children }: Props): JSX.Element => {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

    const { state: { display, permissions } } = useSynchronizedState();
    const { state: { tools }, actions: { selectTool, selectColorByValue, clear } } = useToolbarContext();

    const { classtype, isTeacher, sessionId } = useContext(LocalSessionContext);
    const [activedColor, setActivedColor] = useState({ black: false, blue: false, qingse: false, green: false, orange: false, red: false, yellow: false, pink: false, purple: false, brown: false });
    const [activedTool, setActivedTool] = useState({ move: false, line: false, text: false, erase: false, clear: false });
    const forStudent = classtype === ClassType.STUDY || !isTeacher;

    useEffect(() => {
        selectLine();
        selectBlack("#000000");
    }, [])

    // TODO (Isu): This will be definitely changed.
    const selectBlack = (value: string) => { selectColorByValue(value); setActivedColor({ black: true, blue: false, qingse: false, green: false, orange: false, red: false, yellow: false, pink: false, purple: false, brown: false }); setActivedTool({ move: false, line: activedTool.line, text: false, erase: false, clear: false }); }
    const selectBlue = (value: string) => { selectColorByValue(value); setActivedColor({ black: false, blue: true, qingse: false, green: false, orange: false, red: false, yellow: false, pink: false, purple: false, brown: false }); setActivedTool({ move: false, line: activedTool.line, text: false, erase: false, clear: false }); }
    const selectQingse = (value: string) => { selectColorByValue(value); setActivedColor({ black: false, blue: false, qingse: true, green: false, orange: false, red: false, yellow: false, pink: false, purple: false, brown: false }); setActivedTool({ move: false, line: activedTool.line, text: false, erase: false, clear: false }); }
    const selectGreen = (value: string) => { selectColorByValue(value); setActivedColor({ black: false, blue: false, qingse: false, green: true, orange: false, red: false, yellow: false, pink: false, purple: false, brown: false }); setActivedTool({ move: false, line: activedTool.line, text: false, erase: false, clear: false }); }
    const selectOrange = (value: string) => { selectColorByValue(value); setActivedColor({ black: false, blue: false, qingse: false, green: false, orange: true, red: false, yellow: false, pink: false, purple: false, brown: false }); setActivedTool({ move: false, line: activedTool.line, text: false, erase: false, clear: false }); }
    const selectRed = (value: string) => { selectColorByValue(value); setActivedColor({ black: false, blue: false, qingse: false, green: false, orange: false, red: true, yellow: false, pink: false, purple: false, brown: false }); setActivedTool({ move: false, line: activedTool.line, text: false, erase: false, clear: false }); }
    const selectYellow = (value: string) => { selectColorByValue(value); setActivedColor({ black: false, blue: false, qingse: false, green: false, orange: false, red: false, yellow: true, pink: false, purple: false, brown: false }); setActivedTool({ move: false, line: activedTool.line, text: false, erase: false, clear: false }); }
    const selectPink = (value: string) => { selectColorByValue(value); setActivedColor({ black: false, blue: false, qingse: false, green: false, orange: false, red: false, yellow: false, pink: true, purple: false, brown: false }); setActivedTool({ move: false, line: activedTool.line, text: false, erase: false, clear: false }); }
    const selectPurple = (value: string) => { selectColorByValue(value); setActivedColor({ black: false, blue: false, qingse: false, green: false, orange: false, red: false, yellow: false, pink: false, purple: true, brown: false }); setActivedTool({ move: false, line: activedTool.line, text: false, erase: false, clear: false }); }
    const selectBrown = (value: string) => { selectColorByValue(value); setActivedColor({ black: false, blue: false, qingse: false, green: false, orange: false, red: false, yellow: false, pink: false, purple: false, brown: true }); setActivedTool({ move: false, line: activedTool.line, text: false, erase: false, clear: false }); }

    const selectLine = () => { selectTool("line"); setActivedTool({ move: false, line: true, text: false, erase: false, clear: false }); }
    const selectText = () => { selectTool("text"); setActivedTool({ move: false, line: false, text: true, erase: false, clear: false }); setActivedColor({ black: false, blue: false, qingse: false, green: false, orange: false, red: false, yellow: false, pink: false, purple: false, brown: false }); }
    const selectMove = () => { selectTool("move"); setActivedTool({ move: true, line: false, text: false, erase: false, clear: false }); setActivedColor({ black: false, blue: false, qingse: false, green: false, orange: false, red: false, yellow: false, pink: false, purple: false, brown: false }); }
    const selectObjectEraser = useCallback(() => {
        const eraserOptions = tools.eraser.options;
        if (eraserOptions) {
            selectTool("eraser", eraserOptions[0]);
        }
        setActivedTool({ move: false, line: false, text: false, erase: true, clear: false });
        setActivedColor({ black: false, blue: false, qingse: false, green: false, orange: false, red: false, yellow: false, pink: false, purple: false, brown: false });
    }, [selectTool, tools.eraser.options]);
    const selectClear = () => { clear([sessionId]); setActivedTool({ move: false, line: false, text: false, erase: false, clear: true }); setActivedColor({ black: false, blue: false, qingse: false, green: false, orange: false, red: false, yellow: false, pink: false, purple: false, brown: false }); }

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
        <ColorButton actived={activedColor.black} onClick={() => selectBlack("#000000")} colorValue={"#000000"} crayon={forStudent ? BlackCrayon : undefined} />
        <ColorButton actived={activedColor.blue} onClick={() => selectBlue(blue[600])} colorValue={blue[600]} crayon={forStudent ? BlueCrayon : undefined} />
        <ColorButton actived={activedColor.qingse} onClick={() => selectQingse(cyan["A200"])} colorValue={cyan["A200"]} crayon={forStudent ? QingseCrayon : undefined} />
        <ColorButton actived={activedColor.green} onClick={() => selectGreen(green[500])} colorValue={green[500]} crayon={forStudent ? GreenCrayon : undefined} />
        <ColorButton actived={activedColor.yellow} onClick={() => selectYellow(yellow[500])} colorValue={yellow[500]} crayon={forStudent ? YellowCrayon : undefined} />
        <ColorButton actived={activedColor.orange} onClick={() => selectOrange(orange[500])} colorValue={orange[500]} crayon={forStudent ? OrangeCrayon : undefined} />
        <ColorButton actived={activedColor.red} onClick={() => selectRed(red[500])} colorValue={red[500]} crayon={forStudent ? RedCrayon : undefined} />
        <ColorButton actived={activedColor.pink} onClick={() => selectPink(pink[300])} colorValue={pink[300]} crayon={forStudent ? PinkCrayon : undefined} />
        <ColorButton actived={activedColor.purple} onClick={() => selectPurple(purple[400])} colorValue={purple[400]} crayon={forStudent ? PurpleCrayon : undefined} />
        <ColorButton actived={activedColor.brown} onClick={() => selectBrown(brown[500])} colorValue={brown[500]} crayon={forStudent ? BrownCrayon : undefined} />
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