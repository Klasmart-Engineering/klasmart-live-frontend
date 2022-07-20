import CloseIcon from "@/assets/img/canvas/close_icon.svg";
import PencilIcon from "@/assets/img/canvas/pencil_icon.svg";
import StyledIcon from "@/components/styled/icon";
import CanvasMenuStudy from "@/components/toolbar/toolbarMenus/canvasMenu/canvasMenuStudy";
import {
    THEME_COLOR_BACKGROUND_PAPER,
    THEME_COLOR_ORG_MENU_DRAWER,
} from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { isCanvasOpenState } from "@/store/layoutAtoms";
import { useSynchronizedState } from "@/whiteboard/context-providers/SynchronizedStateProvider";
import {
    darken,
    makeStyles,
    Theme,
} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import clsx from "clsx";
import React,
{ useEffect } from "react";
import { useRecoilState } from "recoil";

export const WB_TOOLBAR_MAX_HEIGHT = 80; // 64 + 16(padding top)

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        position: `relative`,
    },
    buttonWrapStudy: {
        bottom: 0,
        right: theme.spacing(0.5),
    },
    pencilIcon: {
        width: theme.spacing(3.25),
        height: theme.spacing(3.25),
        margin: `auto`,
    },
    closeIcon: {
        width: theme.spacing(2.5),
        height: theme.spacing(2.5),
        padding: theme.spacing(0.75),
    },
    fab: {
        backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        boxShadow: `none`,
        "&:hover": {
            backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        },
    },
    activatedFab: {
        backgroundColor: THEME_COLOR_ORG_MENU_DRAWER,
        boxShadow: `none`,
        "&:hover": {
            background: darken(THEME_COLOR_ORG_MENU_DRAWER, 0.2),
        },
    },
}));

export function WBToolbarContainer () {
    const classes = useStyles();
    const canvasRef = React.useRef<HTMLDivElement>(null);
    const [ isCanvasOpen, setIsCanvasOpen ] = useRecoilState(isCanvasOpenState);

    const {
        classType,
        sessionId,
    } = useSessionContext();
    const {
        actions: {
            setDisplay,
            getPermissions,
            setPermissions,
        },
    } = useSynchronizedState();

    const handleToggleWBToolbar = () => {
        setIsCanvasOpen(!isCanvasOpen);
        const permissions = getPermissions(sessionId);
        const newPermissions = {
            ...permissions,
            allowCreateShapes: true,
        };
        setPermissions(sessionId, newPermissions);
    };

    useEffect(() => {
        setDisplay(isCanvasOpen);
    }, [ isCanvasOpen ]);

    return (
        <>
            <div
                ref={canvasRef}
                className={clsx({
                    [classes.buttonWrapStudy]: classType === ClassType.STUDY,
                })}
            >
                <Fab
                    aria-label="whiteboard toolbar opener"
                    className={clsx({
                        [classes.fab]: !isCanvasOpen,
                        [classes.activatedFab]: isCanvasOpen,
                    })}
                    size="medium"
                    onClick={handleToggleWBToolbar}
                >
                    <StyledIcon
                        size={`xlarge`}
                        icon={isCanvasOpen ? <img
                            alt={`Close Icon`}
                            src={CloseIcon}
                            className={classes.closeIcon}
                                             /> :
                            <img
                                alt={`Pencil Icon`}
                                src={PencilIcon}
                                className={classes.pencilIcon}
                            />
                        }
                    />
                </Fab>
            </div>
            <CanvasMenuStudy
                showCanvasMenu={isCanvasOpen}
                anchor={canvasRef.current}
            />
        </>
    );
}
