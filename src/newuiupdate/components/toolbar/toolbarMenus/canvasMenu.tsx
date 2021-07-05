import { ClassType } from "../../../../store/actions";
import { LocalSessionContext } from "../../../providers/providers";
import { hasControlsState, isCanvasOpenState } from "../../../states/layoutAtoms";
import { useSynchronizedState } from "../../../whiteboard/context-providers/SynchronizedStateProvider";
import { StyledPopper } from "../../utils/utils";
import {
    Grid, makeStyles,  Theme, Tooltip,
} from "@material-ui/core";
import { Move as MoveIcon } from "@styled-icons/boxicons-regular/Move";
import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";
import { Trash as TrashIcon } from "@styled-icons/boxicons-solid/Trash";
import { Pencil as PencilIcon } from "@styled-icons/entypo/Pencil";
import { PeopleCommunity as PeopleCommunityIcon } from "@styled-icons/fluentui-system-filled/PeopleCommunity";
import { SlideEraser as SlideEraserIcon } from "@styled-icons/fluentui-system-regular/SlideEraser";
import { Brush as BrushIcon } from "@styled-icons/material/Brush";
import { GridOff as GridOffIcon } from "@styled-icons/material/GridOff";
import { GridOn as GridOnIcon } from "@styled-icons/material/GridOn";
import { TextFields as TextIcon } from "@styled-icons/material/TextFields";
import clsx from "clsx";
import { useToolbarContext } from "kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";
import React, {
    useCallback, useContext, useEffect, useState,
} from "react";
import { useIntl } from "react-intl";
import { useRecoilState } from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: 4,
    },
    item:{
        padding: `0.4em`,
        margin: `0 1px`,
        cursor: `pointer`,
        borderRadius: 10,
        transition: `100ms all ease-in-out`,
        "&:hover": {
            backgroundColor: theme.palette.grey[200],
        },
    },
    active:{
        color: theme.palette.common.white,
        backgroundColor: theme.palette.text.primary,
        "&:hover": {
            backgroundColor: theme.palette.text.primary,
        },
    },
    disabled:{
        pointerEvents: `none`,
        opacity: 0.4,
    },
}));

interface GlobaActionsMenuProps {
	anchor?: any;
}

function CanvasMenu (props: GlobaActionsMenuProps) {
    const { anchor } = props;
    const classes = useStyles();

    const intl = useIntl();

    const [ isCanvasOpen, setIsCanvasOpen ] = useRecoilState(isCanvasOpenState);
    const [ hasControls, setHasControls ] = useRecoilState(hasControlsState);

    const [ selectedPen, setSelectedPen ] = useState<string|undefined>(undefined);
    const [ selectedEraser, setSelectedEraser ] = useState<boolean>(false);
    const [ selectedText, setSelectedText ] = useState<boolean>(false);
    const [ selectedMove, setSelectedMove ] = useState<boolean>(false);
    const [ toolbarItemsDisabled, setToolbarItemsDisabled ] = useState<boolean>(false);

    const { classtype, sessionId } = useContext(LocalSessionContext);

    const colors = [
        `#000000`, // black
        `#ffffff`, // white
        `#9c9ca5`, // gray
        `#824949`, // brown
        `#fbe739`, // yellow
        `#ffa500`, // orange
        `#ffc0cb`, // pink
        `#ff0000`, // red
        `#00ff00`, // green
        `#0000ff`, // blue
        `#800080`, // purple
    ];

    const {
        state: { display: isGlobalCanvasEnabled },
        actions: { setDisplay: setIsGlobalCanvasEnabled },
    } = useSynchronizedState();

    const {
        state: { tools }, actions: {
            selectTool, selectColorByValue, clear,
        },
    } = useToolbarContext();
    
    const selectObjectEraser = useCallback(() => {
        const eraserOptions = tools.eraser.options;
        if (eraserOptions) {
            selectTool(`eraser`, eraserOptions[0]);
        }
    }, [ selectTool, tools.eraser.options ]);

    useEffect(()=>{
        if(selectedPen !== undefined){
            selectTool(`line`);
            selectColorByValue(selectedPen);
            setSelectedEraser(false);
            setSelectedText(false);
            setSelectedMove(false);
        }
    }, [ selectedPen ]);

    useEffect(()=>{
        if(classtype === ClassType.LIVE){
            setToolbarItemsDisabled(!isGlobalCanvasEnabled)
        }

        if(isGlobalCanvasEnabled){
            setSelectedPen(`#000000`);
        }else{
            setSelectedPen(undefined);
            setSelectedEraser(false);
        }
    }, [ isGlobalCanvasEnabled ]);

    return (
        <StyledPopper
            open={isCanvasOpen}
            anchorEl={anchor}>
            <Grid
                container
                alignItems="stretch"
                className={classes.root}>

                {colors.map(color => (
                    <CanvasMenuItem
                        key={`color-${color}`}
                        color={color}
                        disabled={toolbarItemsDisabled}
                        active={selectedPen === color}
                        icon={<PencilIcon
                            size="1.85rem"
                            style={{
                                stroke: color == `#ffffff` ? `#000000` : `none`,
                            }} />}
                        onClick={ () => {setSelectedPen(color);} }
                    />
                ))}

                <CanvasMenuItem
                    disabled={toolbarItemsDisabled}
                    active={selectedMove}
                    icon={<MoveIcon size="1.85rem"/>}
                    onClick={ () => {  setSelectedMove(true); setSelectedText(false); setSelectedEraser(false); setSelectedPen(undefined);  selectTool(`move`); } } />
                <CanvasMenuItem
                    disabled={toolbarItemsDisabled}
                    active={selectedText}
                    icon={<TextIcon size="1.85rem"/>}
                    onClick={ () => {  setSelectedText(true); setSelectedMove(false); setSelectedEraser(false); setSelectedPen(undefined);  selectTool(`text`); } } />
                <CanvasMenuItem
                    title={intl.formatMessage({
                        id: `whiteboard_eraser`,
                    })}
                    disabled={toolbarItemsDisabled}
                    active={selectedEraser}
                    icon={<EraserIcon size="1.85rem"/>}
                    onClick={ () => {setSelectedPen(undefined);  setSelectedMove(false); setSelectedText(false); selectObjectEraser(); setSelectedEraser(true);  }} />

                <CanvasMenuItem
                    title={intl.formatMessage({
                        id: `whiteboard_clear_canvas`,
                    })}
                    disabled={toolbarItemsDisabled}
                    icon={<SlideEraserIcon size="1.85rem"/>}
                    onClick={ () => { clear([ sessionId ]);} } />

                {(hasControls && classtype === ClassType.LIVE) &&
                <>
                    <CanvasMenuItem
                        title={intl.formatMessage({
                            id: `whiteboard_clear_all_canvas`,
                        })}
                        disabled={toolbarItemsDisabled}
                        icon={<TrashIcon size="1.85rem"/>}
                        onClick={ () => { clear();} } />

                    <CanvasMenuItem
                        title={intl.formatMessage({
                            id: isGlobalCanvasEnabled ? `toggle_all_canvas_off` :  `toggle_all_canvas_on`,
                        })}
                        active={isGlobalCanvasEnabled}
                        icon={isGlobalCanvasEnabled ? <GridOnIcon size="1.85rem"/> : <GridOffIcon size="1.85rem"/>}
                        onClick={ () => {setIsGlobalCanvasEnabled(!isGlobalCanvasEnabled);} } />
                </>
                }
            </Grid>
        </StyledPopper>
    );
}

export default CanvasMenu;

interface CanvasMenuItemProps {
	onClick: any;
    icon: any;
    title?: string;
    active?: boolean;
    color?: string;
    disabled?: boolean;
}

const CanvasMenuItem = (props:CanvasMenuItemProps) => {
    const classes = useStyles();
    const {
        onClick, active, icon, title, color, disabled,
    } = props;

    return(
        <Grid item >
            <Tooltip
                title={title || `Button`}
                disableFocusListener={!title}
                disableHoverListener={!title}
                disableTouchListener={!title}
                placement="top">
                <div
                    className={clsx(classes.item,  {
                        [classes.active] : active,
                        [classes.disabled] : disabled,
                    })}
                    style={color && active ? {
                        color: `#fff`,
                        backgroundColor: color,
                    } : {
                        color: color,
                    }}
                    onClick={onClick}>
                    {icon}
                </div>
            </Tooltip>
        </Grid>
    );
};
