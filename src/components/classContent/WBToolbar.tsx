import PencilIcon from "@/assets/img/canvas/pencil_icon.svg";
import StyledIcon from "@/components/styled/icon";
import CanvasMenu from "@/components/toolbar/toolbarMenus/canvasMenu/canvasMenu";
import { THEME_COLOR_BACKGROUND_PAPER } from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { isCanvasOpenState } from "@/store/layoutAtoms";
import { useSynchronizedState } from "@/whiteboard/context-providers/SynchronizedStateProvider";
import {
    makeStyles,
    Theme,
} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import { CloseOutline as CloseIcon } from "@styled-icons/evaicons-outline/CloseOutline";
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
        width: theme.spacing(3),
        height: theme.spacing(3),
    },
    fab: {
        backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        "&:hover": {
            backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        },
    },
}));

export function WBToolbarContainer () {
    const classes = useStyles();
    const canvasRef = React.useRef<any>();
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
                    className={classes.fab}
                    size="large"
                    color="primary"
                    onClick={handleToggleWBToolbar}
                >
                    <StyledIcon
                        size="large"
                        icon={isCanvasOpen ? <CloseIcon /> :
                            <img
                                alt={`Pencil Icon`}
                                src={PencilIcon}
                                className={classes.pencilIcon}
                            />
                        }
                    />
                </Fab>
            </div>
            <CanvasMenu
                showCanvasMenu={isCanvasOpen}
                anchor={canvasRef.current}
            />
        </>
    );
}
