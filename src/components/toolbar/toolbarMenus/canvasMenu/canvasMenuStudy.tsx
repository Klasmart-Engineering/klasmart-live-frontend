import "inter-ui";
import { CanvasColorSelectorStudy } from "./canvasColorSelectorStudy";
import { selectNewColor } from "./canvasMenu";
import { CanvasMenuItemStudy as CanvasMenuItem } from "./canvasMenuItemStudy";
import PenDefault from "@/assets/img/canvas/crayons/default-pen.svg";
import LeftIcon from "@/assets/img/canvas/left.svg";
import RightIcon from "@/assets/img/canvas/right.svg";
import NewBinIcon from "@/assets/img/canvas/toolbar-items/bin.svg";
import NewCursorIcon from "@/assets/img/canvas/toolbar-items/cursor.svg";
import NewEraserIcon from "@/assets/img/canvas/toolbar-items/eraser.svg";
import NewMoveIcon from "@/assets/img/canvas/toolbar-items/move.svg";
import NewTextIcon from "@/assets/img/canvas/toolbar-items/text.svg";
import NewTextActiveIcon from "@/assets/img/canvas/toolbar-items/text-active.svg";
import { UsersDrawIcon } from "@/assets/img/canvas/users_draw";
import { Switch } from "@/components/styled/switch";
import {
    THEME_BORDER_COLOR,
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_ORG_MENU_DRAWER,
} from "@/config";
import { useSessions } from "@/data/live/state/useSessions";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    canvasDrawColorState,
    canvasSelectedItemState,
    hasControlsState,
    isCanvasOpenState,
} from "@/store/layoutAtoms";
import {
    CanvasColor,
    CanvasColors,
} from "@/utils/canvas.utils";
import { StyledPopper } from "@/utils/utils";
import { useSynchronizedState } from "@/whiteboard/context-providers/SynchronizedStateProvider";
import { useToolbarContext } from "@kl-engineering/kidsloop-canvas/dist/components/toolbar/toolbar-context-provider";
import {
    darken,
    Fab,
    Grid,
    makeStyles,
    Tooltip,
    useTheme,
} from "@material-ui/core";
import { ArrowsMove as MoveIcon } from "@styled-icons/bootstrap/ArrowsMove";
import { Pencil as PencilIcon } from "@styled-icons/boxicons-regular/Pencil";
import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";
import { Trash as TrashIcon } from "@styled-icons/boxicons-solid/Trash";
import { Text as TextIcon } from "@styled-icons/evaicons-solid/Text";
import { Cursor as CursorIcon } from "@styled-icons/fluentui-system-regular/Cursor";
import clsx from "clsx";
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

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(0.5, 2.5),
        background: `white`,
        borderRadius: theme.spacing(2.75),
        border: `1.5px solid`,
        borderColor: THEME_BORDER_COLOR,
        marginRight: theme.spacing(1.5),
    },
    divider: {
        width: 1,
        backgroundColor: theme.palette.grey[300],
        margin: theme.spacing(0.75, 0.5),
    },
    hideCanvasMenu: {
        display: `none`,
    },
    fab: {
        background: THEME_COLOR_BACKGROUND_PAPER,
        border: `1px solid`,
        borderColor: THEME_BORDER_COLOR,
        "& img": {
            width: 14,
        },
        "&:hover": {
            background: darken(THEME_COLOR_ORG_MENU_DRAWER, 0.2),
        },

    },
    activatedFab: {
        background: THEME_COLOR_ORG_MENU_DRAWER,
    },
    toolbarItemIcon: {
        width: 28,
        height: 28,
    },
    toolbarRoot: {
        display: `grid`,
        gridGap: 20,
    },
}));

export enum CanvasToolbarItems {
    PENCIL,
    TEXT,
    CURSOR,
    MOVE,
    ERASER,
    ALLOW_EVERYONE
}

interface GlobaActionsMenuProps {
    anchor: HTMLElement | null;
    showCanvasMenu?: boolean;
}

function CanvasMenuStudy (props: GlobaActionsMenuProps) {
    const { anchor, showCanvasMenu } = props;
    const classes = useStyles();
    const intl = useIntl();
    const theme = useTheme();

    const isCanvasOpen = useRecoilValue(isCanvasOpenState);
    const hasControls = useRecoilValue(hasControlsState);

    const pencilRef = React.useRef<HTMLElement>();
    const textRef = React.useRef<HTMLElement>();

    const [ isCanvasColorsOpen, setIsCanvasColorsOpen ] = useState<boolean>(false);
    const [ colorsMenuAnchor, setColorsMenuAnchor ] = useState<null | HTMLElement>(null);
    const [ isToolbarActive, setIsToolbarActive ] = React.useState(true);

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
            if(!pencilRef.current) return;
            setColorsMenuAnchor(pencilRef.current);
            selectTool(`line`);
            break;
        case CanvasToolbarItems.TEXT:
            if(!textRef.current) return;
            setColorsMenuAnchor(textRef.current);
            selectTool(`text`);
            break;
        case CanvasToolbarItems.MOVE:
            selectTool(`move`);
            break;
        case CanvasToolbarItems.ERASER:
            selectObjectEraser();
            break;
        case CanvasToolbarItems.CURSOR:
            selectTool(`clickthrough`);
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

        CanvasColors.forEach(item => {
            if(item.name === canvasDrawColor)
            {
                setPenIcon(item.img);
                return;
            }
        });

    }, [ canvasDrawColor ]);

    useEffect(() => {
        setUsersDraw(studentsAndSubTeachers.size === currentUserPermissions.size);
    }, [ studentsAndSubTeachers.size, currentUserPermissions.size ]);

    useEffect(() => {
        if (isCanvasOpen) return;
        setIsCanvasColorsOpen(false);
    }, [ isCanvasOpen ]);

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

    const selectItemWithColor = (newSelectedItem: CanvasToolbarItems) => (previousSelectedItem: CanvasToolbarItems) => {
        if (previousSelectedItem === newSelectedItem) {
            setIsCanvasColorsOpen((isOpen) => !isOpen);
        } else {
            setIsCanvasColorsOpen(true);
        }
        return newSelectedItem;
    };

    // Styles for PENCIL and TEXT active
    const activeCustomStyles = {
        backgroundColor: `rgba(64, 184, 244, 0.2)`,
    };

    const [ penIcon, setPenIcon ] = useState(PenDefault);

    useEffect(() => {
        if (!showCanvasMenu) {
            setIsCanvasColorsOpen(false);
        }
    }, [ showCanvasMenu ]);

    const handleToolbarToggle = () => {
        setIsToolbarActive(!isToolbarActive);
    };

    return (
        <>
            <StyledPopper
                open={isCanvasOpen}
                anchorEl={anchor}
                style={{
                    background: `transparent`,
                    boxShadow: `none`,
                }}
                placement={classType === ClassType.STUDY ? `right-end` : `top`}
                modifiers={classType === ClassType.STUDY || classType === ClassType.CLASSES ? {
                    offset: {
                        enabled: true,
                        offset: `0, 4`,
                    },
                    preventOverflow: {
                        boundariesElement: document.getElementById(`main-content`),
                    },
                } : undefined}
            >
                <Grid
                    container
                    alignItems="flex-end"
                    style={{
                        gridGap: 10,
                    }}
                >

                    {isToolbarActive && (
                        <Grid
                            item
                            className={classes.toolbarRoot}
                        >
                            {isCanvasColorsOpen && isToolbarActive &&

                        <CanvasColorSelectorStudy
                            showBottomChevron
                            activeColor={canvasDrawColor}
                            palette={Object.values(CanvasColor)}
                            selectedItem={canvasSelectedItem}
                            onSelectColor={(value) => setCanvasDrawColor(selectNewColor(value))}
                        />
                            }
                            <Grid
                                container
                                alignItems="stretch"
                                className={clsx(classes.root, {
                                    [classes.hideCanvasMenu]: !showCanvasMenu,
                                })}
                            >
                                <CanvasMenuItem
                                    ref={pencilRef}
                                    title={intl.formatMessage({
                                        id: `canvas.tool.pen`,
                                    })}

                                    activeStyles={activeCustomStyles}
                                    active={canvasSelectedItem === CanvasToolbarItems.PENCIL}
                                    icon={
                                        <img
                                            alt={`Pen Icon`}
                                            src={penIcon}
                                            className={classes.toolbarItemIcon}
                                        />
                                    }
                                    onClick={() => setCanvasSelectedItem(selectItemWithColor(CanvasToolbarItems.PENCIL))}
                                />
                                <CanvasMenuItem
                                    ref={textRef}
                                    title={intl.formatMessage({
                                        id: `canvas.tool.text`,
                                    })}
                                    activeStyles={activeCustomStyles}

                                    active={canvasSelectedItem === CanvasToolbarItems.TEXT}
                                    icon={
                                        <img
                                            alt={`Text Icon`}
                                            src={canvasSelectedItem === CanvasToolbarItems.TEXT ? NewTextActiveIcon : NewTextIcon}
                                            className={classes.toolbarItemIcon}
                                        />
                                    }
                                    onClick={() => setCanvasSelectedItem(selectItemWithColor(CanvasToolbarItems.TEXT))}
                                />
                                <CanvasMenuItem
                                    active={canvasSelectedItem === CanvasToolbarItems.MOVE}
                                    icon={
                                        <img
                                            src={NewMoveIcon}
                                            alt={`Move Icon`}
                                            className={classes.toolbarItemIcon}
                                        />
                                    }
                                    title={intl.formatMessage({
                                        id: `canvas.tool.move`,
                                    })}
                                    onClick={() => setCanvasSelectedItem(CanvasToolbarItems.MOVE)}
                                />
                                <CanvasMenuItem
                                    active={canvasSelectedItem === CanvasToolbarItems.CURSOR}
                                    icon={
                                        <img
                                            src={NewCursorIcon}
                                            alt={`Cursor Icon`}
                                            className={classes.toolbarItemIcon}
                                        />
                                    }
                                    title={intl.formatMessage({
                                        id: `canvas.tool.select`,
                                    })}
                                    onClick={() => setCanvasSelectedItem(CanvasToolbarItems.CURSOR)}
                                />
                                <Grid
                                    item
                                    className={classes.divider}
                                />
                                <CanvasMenuItem
                                    title={intl.formatMessage({
                                        id: `canvas.tool.eraser`,
                                    })}
                                    active={canvasSelectedItem === CanvasToolbarItems.ERASER}
                                    icon={
                                        <img
                                            src={NewEraserIcon}
                                            alt={`Eraser Icon`}
                                            className={classes.toolbarItemIcon}
                                        />
                                    }
                                    onClick={() => setCanvasSelectedItem(CanvasToolbarItems.ERASER)}
                                />
                                <CanvasMenuItem
                                    title={intl.formatMessage({
                                        id: `canvas.tool.eraseAll`,
                                    })}
                                    icon={
                                        <img
                                            src={NewBinIcon}
                                            alt={`Bin Icon`}
                                            className={classes.toolbarItemIcon}
                                        />
                                    }
                                    onClick={() => clear([ sessionId ])}
                                />

                                {(hasControls && classType === ClassType.LIVE) &&
                        <>
                            <Grid
                                item
                                className={classes.divider}
                            />
                            <CanvasMenuItem
                                title={intl.formatMessage({
                                    id: usersDraw ? `canvas.tool.allCanvas.off` : `canvas.tool.allCanvas.on`,
                                })}
                                active={usersDraw}
                                icon={<UsersDrawIcon size="1.6rem" />}
                                onClick={handleClickUsersDraw}
                            />
                            <Grid
                                item
                                className={classes.divider}
                            />
                            <Grid item>
                                <Tooltip
                                    placement="top"
                                    title={intl.formatMessage({
                                        id: `canvas.tool.myCanvas.off`,
                                    })}
                                >
                                    <Switch
                                        checked={isGlobalCanvasEnabled}
                                        onChange={() => setIsGlobalCanvasEnabled(!isGlobalCanvasEnabled)}
                                    />
                                </Tooltip>
                            </Grid>
                        </>
                                }
                            </Grid>
                        </Grid>
                    )}
                    <Grid item>
                        <Fab
                            style={{
                                boxShadow: `none`,
                            }}
                            aria-label="toolbar-toggle"
                            size="medium"
                            className={clsx(classes.fab, {
                                [classes.activatedFab]: isToolbarActive,
                            })}
                            onClick={handleToolbarToggle}
                        >

                            <img
                                alt={`Right Icon`}
                                height={`22px`}
                                src={isToolbarActive ? LeftIcon : RightIcon}
                                style={{
                                    margin: `0 auto`,
                                }}
                            />
                        </Fab>
                    </Grid>
                </Grid>

            </StyledPopper>

        </>
    );
}

export default CanvasMenuStudy;
