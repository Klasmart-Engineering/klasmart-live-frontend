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
        padding: `8px 16px`,
        margin: `0 4px`,
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

    const { sessionId } = useContext(LocalSessionContext);

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
        }
    }, [ selectedPen ]);

    useEffect(()=>{
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
                <CanvasMenuItem
                    color='#000000'
                    disabled={!isGlobalCanvasEnabled}
                    active={selectedPen === `#000000`}
                    icon={<PencilIcon size="2rem"/>}
                    onClick={ () => {setSelectedPen(`#000000`);} } />
                <CanvasMenuItem
                    color='#0000ff'
                    disabled={!isGlobalCanvasEnabled}
                    active={selectedPen === `#0000ff`}
                    icon={<PencilIcon size="2rem"/>}
                    onClick={ () => { setSelectedPen(`#0000ff`);} } />
                <CanvasMenuItem
                    color='#00ff00'
                    disabled={!isGlobalCanvasEnabled}
                    active={selectedPen === `#00ff00`}
                    icon={<PencilIcon size="2rem"/>}
                    onClick={ () => { setSelectedPen(`#00ff00`);} } />
                <CanvasMenuItem
                    color='#fbe739'
                    disabled={!isGlobalCanvasEnabled}
                    active={selectedPen === `#fbe739`}
                    icon={<PencilIcon size="2rem"/>}
                    onClick={ () => {setSelectedPen(`#fbe739`);} } />
                <CanvasMenuItem
                    color='#ff0000'
                    disabled={!isGlobalCanvasEnabled}
                    active={selectedPen === `#ff0000`}
                    icon={<PencilIcon size="2rem"/>}
                    onClick={ () => {setSelectedPen(`#ff0000`);} } />

                {/* MORE TOOLS : they work but not used
                <Grid
                    item
                    className={classes.item}
                    onClick={() => { selectTool(`move`); } }
                >
                    <MoveIcon size="2rem"/>
                </Grid>
                <Grid
                    item
                    className={classes.item}
                    onClick={() => { selectTool(`text`); } }
                >
                    <TextIcon size="2rem"/>
                </Grid>
                */}

                <CanvasMenuItem
                    title={intl.formatMessage({
                        id: `whiteboard_eraser`,
                    })}
                    disabled={!isGlobalCanvasEnabled}
                    active={selectedEraser}
                    icon={<EraserIcon size="2rem"/>}
                    onClick={ () => {setSelectedPen(undefined);  selectObjectEraser(); setSelectedEraser(true);  }} />

                <CanvasMenuItem
                    title={intl.formatMessage({
                        id: `whiteboard_clear_canvas`,
                    })}
                    disabled={!isGlobalCanvasEnabled}
                    icon={<SlideEraserIcon size="2rem"/>}
                    onClick={ () => { clear([ sessionId ]);} } />

                {hasControls &&
                <>
                    <CanvasMenuItem
                        title={intl.formatMessage({
                            id: `whiteboard_clear_all_canvas`,
                        })}
                        disabled={!isGlobalCanvasEnabled}
                        icon={<TrashIcon size="2rem"/>}
                        onClick={ () => { clear();} } />

                    <CanvasMenuItem
                        title={intl.formatMessage({
                            id: isGlobalCanvasEnabled ? `toggle_all_canvas_off` :  `toggle_all_canvas_on`,
                        })}
                        active={isGlobalCanvasEnabled}
                        icon={isGlobalCanvasEnabled ? <GridOnIcon size="2rem"/> : <GridOffIcon size="2rem"/>}
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
