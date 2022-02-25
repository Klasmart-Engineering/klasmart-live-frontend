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
    buttonWrap: {
        position: `absolute`,
        zIndex: 999,
        bottom: 10,
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
        backgroundColor: FAB_DEFAULT_COLOR,
    },
    fabStudy: {
        backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        "&:hover": {
            backgroundColor: THEME_COLOR_BACKGROUND_PAPER,
        },
    },
}));

export function WBToolbarContainer ({ useLocalDisplay } : { useLocalDisplay?: boolean} ) {
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
        <Grid
            item
            xs={12}
            className={classes.root}>
            <div
                ref={canvasRef}
                className={clsx(classes.buttonWrap, {
                    [classes.buttonWrapStudy]: classType === ClassType.STUDY,
                })}>
                <Fab
                    aria-label="whiteboard toolbar opener"
                    disabled={!enableWB}
                    className={clsx(classes.fab, {
                        [classes.fabStudy]: classType === ClassType.STUDY,
                    })}
                    size="large"
                    color="primary"
                    onClick={handleToggleWBToolbar}
                >
                    <StyledIcon
                        size="large"
                        color={classType !== ClassType.STUDY ? THEME_COLOR_BACKGROUND_PAPER : TEXT_COLOR_MENU_DRAWER}
                        icon={isCanvasOpen ? <CloseIcon /> : classType === ClassType.STUDY ?
                            <img
                                src={PencilIcon}
                                className={classes.pencilIcon} /> :
                            <WBIcon />
                        }
                    />
                </Fab>
            </div>
            <CanvasMenu anchor={canvasRef.current} />
        </Grid>
    );
}
