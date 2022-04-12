import PencilIcon from "@/assets/img/canvas/pencil_icon.svg";
import StyledIcon from "@/components/styled/icon";
import CanvasMenu from "@/components/toolbar/toolbarMenus/canvasMenu/canvasMenu";
import {
    FAB_DEFAULT_COLOR,
    TEXT_COLOR_MENU_DRAWER,
    THEME_COLOR_BACKGROUND_PAPER,
} from "@/config";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { isCanvasOpenState } from "@/store/layoutAtoms";
import { useSynchronizedState } from "@/whiteboard/context-providers/SynchronizedStateProvider";
import {
    Grid,
    makeStyles,
    Theme,
} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import { CloseOutline as CloseIcon } from "@styled-icons/evaicons-outline/CloseOutline";
import { PencilAlt as WBIcon } from "@styled-icons/fa-solid/PencilAlt";
import clsx from "clsx";
import React,
{ useContext } from "react";
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
        width: `1.5rem`,
        height: `1.5rem`,
    },
    fab: {
        backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        "&:hover": {
            backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        },
    },
}));

export function WBToolbarContainer ({ useLocalDisplay }: { useLocalDisplay?: boolean} ) {
    const classes = useStyles();
    const canvasRef = React.useRef<any>();
    const [ isCanvasOpen, setIsCanvasOpen ] = useRecoilState(isCanvasOpenState);

    const {
        classType,
        isTeacher,
        sessionId,
    } = useSessionContext();
    const {
        state: { display, permissions },
        actions: {
            setDisplay,
            setLocalDisplay,
            getPermissions,
            setPermissions,
        },
    } = useSynchronizedState();

    const enableWB = classType === ClassType.LIVE ? (!isTeacher ? display && permissions.allowCreateShapes : display) : true;

    const handleToggleWBToolbar = () => {
        setIsCanvasOpen(!isCanvasOpen);

        if (useLocalDisplay) {
            setLocalDisplay((localDisplay) => !localDisplay);
        } else if (classType !== ClassType.LIVE) {
            setDisplay(!display);
        }

        if (classType !== ClassType.LIVE) {
            const permissions = getPermissions(sessionId);
            const newPermissions = {
                ...permissions,
                allowCreateShapes: true,
            };
            setPermissions(sessionId, newPermissions);
        }

    };

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
                    disabled={!enableWB}
                    className={classes.fab}
                    size="large"
                    color="primary"
                    onClick={handleToggleWBToolbar}
                >
                    <StyledIcon
                        size="large"
                        icon={isCanvasOpen ? <CloseIcon /> :
                            <img
                                alt={``}
                                src={PencilIcon}
                                className={classes.pencilIcon}
                            />
                        }
                    />
                </Fab>
            </div>
            <CanvasMenu anchor={canvasRef.current} />
        </>
    );
}
