import StyledIcon from "@/components/styled/icon";
import CanvasMenu from "@/components/toolbar/toolbarMenus/canvasMenu";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { isCanvasOpenState } from "@/store/layoutAtoms";
import { useSynchronizedState } from "@/whiteboard/context-providers/SynchronizedStateProvider";
import {
    Grid,
    makeStyles,
} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import { CloseOutline as CloseIcon } from "@styled-icons/evaicons-outline/CloseOutline";
import { PencilAlt as WBIcon } from "@styled-icons/fa-solid/PencilAlt";
import React,
{ useContext } from "react";
import { useRecoilState } from "recoil";

export const WB_TOOLBAR_MAX_HEIGHT = 80; // 64 + 16(padding top)

const useStyles = makeStyles(() => ({
    root: {
        position: `relative`,
    },
    buttonWrap: {
        position: `absolute`,
        zIndex: 999,
        bottom: 10,
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
        state: {
            display, permissions, localDisplay,
        }, actions: {
            setDisplay, setLocalDisplay, getPermissions, setPermissions,
        },
    } = useSynchronizedState();

    const enableWB = classType === ClassType.LIVE ? (!isTeacher ? display && permissions.allowCreateShapes : display) : true;

    const handleToggleWBToolbar = () => {
        setIsCanvasOpen(!isCanvasOpen);

        if (useLocalDisplay) {
            setLocalDisplay(!localDisplay);
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
                className={classes.buttonWrap}>
                <Fab
                    aria-label="whiteboard toolbar opener"
                    disabled={!enableWB}
                    size="large"
                    color="primary"
                    style={{
                        backgroundColor:`#bd6dd6`,
                    }}
                    onClick={handleToggleWBToolbar}
                >
                    <StyledIcon
                        icon={isCanvasOpen ? <CloseIcon /> : <WBIcon />}
                        size="large"
                        color="white" />
                </Fab>
            </div>
            <CanvasMenu anchor={canvasRef.current} />
        </Grid>
    );
}
