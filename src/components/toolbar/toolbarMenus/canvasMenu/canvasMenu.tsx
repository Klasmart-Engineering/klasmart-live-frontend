import { CanvasColorSelector } from "./canvasColorSelector";
import { CanvasMenuItem } from "./canvasMenuItem";
import { UsersDrawIcon } from "@/assets/img/canvas/users_draw";
import { Switch } from "@/components/styled/switch";
import { useSessions } from "@/data/live/state/useSessions";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    canvasDrawColorState,
    canvasSelectedItemState,
    hasControlsState,
    isCanvasOpenState,
} from "@/store/layoutAtoms";
import { StyledPopper } from "@/utils/utils";
import { useSynchronizedState } from "@/whiteboard/context-providers/SynchronizedStateProvider";
import {
    Grid,
    makeStyles,
    Theme,
    Tooltip,
    useTheme,
} from "@material-ui/core";
import { ArrowsMove as MoveIcon } from "@styled-icons/bootstrap/ArrowsMove";
import { Pencil as PencilIcon } from "@styled-icons/boxicons-regular/Pencil";
import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";
import { Trash as TrashIcon } from "@styled-icons/boxicons-solid/Trash";
import { Text as TextIcon } from "@styled-icons/evaicons-solid/Text";
import { useToolbarContext } from "kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";
import React,
{
    useCallback,
    useEffect,
    useState,
} from "react";
import { useIntl } from "react-intl";
import {
    useRecoilState,
    useRecoilValue,
} from "recoil";

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        padding: theme.spacing(0.5),
    },
    divider: {
        width: 1,
        backgroundColor: theme.palette.grey[300],
        margin: theme.spacing(0.75, 0.5),
    },
}));

export enum CanvasToolbarItems {
    PENCIL,
    TEXT,
    MOVE,
    ERASER,
    ALLOW_EVERYONE
}

export enum CanvasColor {
    BLACK = `#000000`,
    WHITE = `#ffffff`,
    GRAY = `#9c9ca5`,
    BROWN = `#824949`,
    YELLOW = `#fbe739`,
    ORANGE = `#ffa500`,
    PINK = `#ffc0cb`,
    RED = `#ff0000`,
    GREEN = `#00ff00`,
    BLUE = `#0000ff`,
    PURPLE = `#800080`,
}

interface GlobaActionsMenuProps {
	anchor: HTMLElement;
}

function CanvasMenu (props: GlobaActionsMenuProps) {
    const { anchor } = props;
    const classes = useStyles();
    const intl = useIntl();
    const theme = useTheme();

    const isCanvasOpen = useRecoilValue(isCanvasOpenState);
    const hasControls = useRecoilValue(hasControlsState);

    const pencilRef = React.useRef<HTMLElement>();
    const textRef = React.useRef<HTMLElement>();

    const [ isCanvasColorsOpen, setIsCanvasColorsOpen ] = useState<boolean>(false);
    const [ colorsMenuAnchor, setColorsMenuAnchor ] = useState<null|undefined|HTMLElement>();

    const [ canvasDrawColor, setCanvasDrawColor ] = useRecoilState(canvasDrawColorState);
    const [ canvasSelectedItem, setCanvasSelectedItem ] = useRecoilState(canvasSelectedItemState);

    const [ usersDraw, setUsersDraw ] = useState<boolean>(false);

    const { classType, sessionId } = useSessionContext();
    const sessions = useSessions();

    const {
        state: { display: isGlobalCanvasEnabled, userPermissions },
        actions: {
            setDisplay: setIsGlobalCanvasEnabled, getPermissions, setPermissions,
        },
    } = useSynchronizedState();

    const {
        state: { tools }, actions: {
            selectTool, selectColorByValue, clear,
        },
    } = useToolbarContext();

    // studentsAndSubTeachers = sessions without host
    const studentsAndSubTeachers = new Map(sessions);
    for (const [ key, value ] of studentsAndSubTeachers) {
        if(value.isHost){
            studentsAndSubTeachers.delete(key);
        }
    }

    // currentUserPermissions = userPermissions without old users and users without allowCreateShapes
    const currentUserPermissions = new Map(userPermissions);
    for (const [ key, value ] of currentUserPermissions) {
        if(!([ ...studentsAndSubTeachers.keys() ].includes(key) && value.allowCreateShapes)){
            currentUserPermissions.delete(key);
        }
    }

    const openCanvasColors = isCanvasOpen && isCanvasColorsOpen && colorsMenuAnchor !== null;

    const selectObjectEraser = useCallback(() => {
        const eraserOptions = tools.eraser.options;
        if (eraserOptions) {
            selectTool(`eraser`, eraserOptions[0]);
        }
    }, [ selectTool, tools.eraser.options ]);

    useEffect(() => {
        if(canvasSelectedItem !== CanvasToolbarItems.PENCIL && canvasSelectedItem !== CanvasToolbarItems.TEXT) setIsCanvasColorsOpen(false);

        switch (canvasSelectedItem) {
        case CanvasToolbarItems.PENCIL:
            setColorsMenuAnchor(pencilRef.current);
            setIsCanvasColorsOpen(true);
            selectTool(`line`);
            break;
        case CanvasToolbarItems.TEXT:
            setColorsMenuAnchor(textRef.current);
            setIsCanvasColorsOpen(true);
            selectTool(`text`);
            break;
        case CanvasToolbarItems.MOVE:
            selectTool(`move`);
            break;
        case CanvasToolbarItems.ERASER:
            selectObjectEraser();
            break;
        case CanvasToolbarItems.ALLOW_EVERYONE:
            break;
        default:
            break;
        }
    }, [ canvasSelectedItem, pencilRef.current ]);

    useEffect(()=>{
        if(!canvasDrawColor) return;
        selectColorByValue(canvasDrawColor);
        setIsCanvasColorsOpen(false);
    }, [ canvasDrawColor ]);

    useEffect(() => {
        setUsersDraw(studentsAndSubTeachers.size === currentUserPermissions.size);
    }, [ studentsAndSubTeachers.size, currentUserPermissions.size ]);

    useEffect(() => {
        if (isCanvasOpen) return;
        setColorsMenuAnchor(null);
    }, [ isCanvasOpen ]);

    const handleClickClear = () => {
        if(hasControls && classType === ClassType.LIVE){
            clear();
        }else{
            clear([ sessionId ]);
        }
    };

    const handleClickUsersDraw = () => {
        studentsAndSubTeachers.forEach(user => {
            const permissions = getPermissions(user.id);
            const newPermissions = {
                ...permissions,
                allowCreateShapes: !usersDraw,
            };
            setPermissions(user.id, newPermissions);
        });
    };

    // Styles for PENCIL and TEXT active
    const activeCustomStyles = {
        color: canvasDrawColor === CanvasColor.WHITE ? theme.palette.getContrastText(canvasDrawColor) : theme.palette.common.white,
        backgroundColor: canvasDrawColor,
        boxShadow: canvasDrawColor === CanvasColor.WHITE ? `inset 0px 0px 0px 3px ${theme.palette.getContrastText(canvasDrawColor)}` : `inherit`,
    };

    return (
        <>
            <StyledPopper
                open={isCanvasOpen}
                anchorEl={anchor}
                placement={classType === ClassType.STUDY ? `top-end` : `top`}
                modifiers={ classType === ClassType.STUDY ? {
                    offset: {
                        enabled: true,
                        offset: `0, 4`,
                    },
                } : undefined}>
                <Grid
                    container
                    alignItems="stretch"
                    className={classes.root}>
                    <CanvasMenuItem
                        ref={pencilRef}
                        hasSubmenu
                        title={intl.formatMessage({
                            id: `canvas.tool.pen`,
                        })}
                        active={canvasSelectedItem === CanvasToolbarItems.PENCIL}
                        activeStyles={activeCustomStyles}
                        icon={<PencilIcon size="1.85rem" />}
                        onClick={() => { canvasSelectedItem !== CanvasToolbarItems.PENCIL ? setCanvasSelectedItem(CanvasToolbarItems.PENCIL) : setIsCanvasColorsOpen(!isCanvasColorsOpen); }} />
                    <CanvasMenuItem
                        ref={textRef}
                        hasSubmenu
                        title={intl.formatMessage({
                            id: `canvas.tool.text`,
                        })}
                        active={canvasSelectedItem === CanvasToolbarItems.TEXT}
                        activeStyles={activeCustomStyles}
                        icon={<TextIcon size="1.85rem" />}
                        onClick={() => { canvasSelectedItem !== CanvasToolbarItems.TEXT ? setCanvasSelectedItem(CanvasToolbarItems.TEXT) : setIsCanvasColorsOpen(!isCanvasColorsOpen); }} />
                    <CanvasMenuItem
                        active={canvasSelectedItem === CanvasToolbarItems.MOVE}
                        icon={<MoveIcon size="1.85rem"/>}
                        title={intl.formatMessage({
                            id: `canvas.tool.move`,
                        })}
                        onClick={() => setCanvasSelectedItem(CanvasToolbarItems.MOVE)} />
                    <Grid
                        item
                        className={classes.divider}></Grid>
                    <CanvasMenuItem
                        title={intl.formatMessage({
                            id: `canvas.tool.eraser`,
                        })}
                        active={canvasSelectedItem === CanvasToolbarItems.ERASER}
                        icon={<EraserIcon size="1.85rem"/>}
                        onClick={() => setCanvasSelectedItem(CanvasToolbarItems.ERASER)} />
                    <CanvasMenuItem
                        title={intl.formatMessage({
                            id: `canvas.tool.eraseAll`,
                        })}
                        icon={<TrashIcon size="1.85rem"/>}
                        onClick={handleClickClear} />

                    {(hasControls && classType === ClassType.LIVE) &&
                        <>
                            <Grid
                                item
                                className={classes.divider}></Grid>
                            <CanvasMenuItem
                                title={intl.formatMessage({
                                    id: usersDraw ? `canvas.tool.allCanvas.off` :  `canvas.tool.allCanvas.on`,
                                })}
                                active={usersDraw}
                                icon={<UsersDrawIcon size="1.6rem"/>}
                                onClick={handleClickUsersDraw} />
                            <Grid
                                item
                                className={classes.divider}></Grid>
                            <Grid item>
                                <Tooltip
                                    placement="top"
                                    title={intl.formatMessage({
                                        id: `canvas.tool.myCanvas.off`,
                                    })}>
                                    <Switch
                                        checked={isGlobalCanvasEnabled}
                                        onChange={() => { setIsGlobalCanvasEnabled(!isGlobalCanvasEnabled); }} />
                                </Tooltip>
                            </Grid>
                        </>
                    }
                </Grid>
            </StyledPopper>
            {openCanvasColors &&
                <StyledPopper
                    open={openCanvasColors}
                    placement="top-start"
                    modifiers={{
                        offset: {
                            enabled: true,
                            offset: `-4,8`,
                        },
                    }}
                    anchorEl={colorsMenuAnchor}>
                    <CanvasColorSelector
                        activeColor={canvasDrawColor}
                        palette={Object.values(CanvasColor)}
                        onSelectColor={setCanvasDrawColor} />
                </StyledPopper>
            }
        </>
    );
}

export default CanvasMenu;
