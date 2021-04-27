import { LocalSessionContext } from "../../../providers/providers";
import { hasControlsState, isCanvasOpenState } from "../../../states/layoutAtoms";
import { useSynchronizedState } from "../../../whiteboard/context-providers/SynchronizedStateProvider";
import { StyledPopper } from "../../utils/utils";
import {
    Grid, makeStyles,  Theme,
} from "@material-ui/core";
import { Move as MoveIcon } from "@styled-icons/boxicons-regular/Move";
import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";
import { Trash as TrashIcon } from "@styled-icons/boxicons-solid/Trash";
import { Pencil as PencilIcon } from "@styled-icons/entypo/Pencil";
import { PeopleCommunity as PeopleCommunityIcon } from "@styled-icons/fluentui-system-filled/PeopleCommunity";
import { Brush as BrushIcon } from "@styled-icons/material/Brush";
import { TextFields as TextIcon } from "@styled-icons/material/TextFields";
import clsx from "clsx";
import { useToolbarContext } from "kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";
import React, { useCallback, useContext } from "react";
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
}));

const items = [
    {
        id: `1`,
        color: `#000000`,
    },
    {
        id: `2`,
        color: `#0000ff`,
    },
    {
        id: `4`,
        color: `#00ff00`,
    },
    {
        id: `5`,
        color: `#fbe739`,
    },
    {
        id: `6`,
        color: `#ff0000`,
    },
];
interface GlobaActionsMenuProps {
	anchor?: any;
}

function CanvasMenu (props: GlobaActionsMenuProps) {
    const { anchor } = props;
    const classes = useStyles();

    const [ isCanvasOpen, setIsCanvasOpen ] = useRecoilState(isCanvasOpenState);
    const [ hasControls, setHasControls ] = useRecoilState(hasControlsState);

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

    return (
        <StyledPopper
            open={isCanvasOpen}
            anchorEl={anchor}>
            <Grid
                container
                alignItems="stretch"
                className={classes.root}>
                {items.map((item) => (
                    <Grid
                        key={item.id}
                        item
                        style={{
                            color: item.color,
                        }}
                        className={classes.item}

                        onClick={() => {selectTool(`line`); selectColorByValue(item.color);} }
                    >
                        <PencilIcon size="2rem"/>
                    </Grid>
                ))}
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
                <Grid
                    item
                    className={classes.item}
                    onClick={() => { selectObjectEraser(); } }
                >
                    <EraserIcon size="2rem"/>
                </Grid>
                <Grid
                    item
                    className={classes.item}
                    onClick={() => {  clear([ sessionId ]); } }
                >
                    <TrashIcon size="2rem"/>
                </Grid>

                {hasControls &&
                <>
                    <Grid
                        item
                        className={classes.item}
                        onClick={() => { clear() ; } }
                    >
                        <TrashIcon size="2rem"/>
                    </Grid>
                    <Grid
                        item
                        className={clsx(classes.item,  {
                            [classes.active] : isGlobalCanvasEnabled,
                        })}
                        onClick={() => { setIsGlobalCanvasEnabled(!isGlobalCanvasEnabled); }}
                    >
                        <PeopleCommunityIcon size="2rem"/>
                    </Grid>
                </>
                }
            </Grid>
        </StyledPopper>
    );
}

export default CanvasMenu;
