import StyledIcon from "../../../components/styled/icon";
import { ClassType } from "../../../store/actions";
import { LocalSessionContext } from "../../providers/providers";
import { useSynchronizedState } from "../../whiteboard/context-providers/SynchronizedStateProvider";
import Fab from "@material-ui/core/Fab";
import { PencilAlt as WBIcon } from "@styled-icons/fa-solid/PencilAlt";
import { CloseOutline as CloseIcon } from "@styled-icons/evaicons-outline/CloseOutline";
import React, {useContext, useEffect, useState} from "react";
import CanvasMenu from "../toolbar/toolbarMenus/canvasMenu";
import {useRecoilState} from "recoil";
import {isCanvasOpenState} from "../../states/layoutAtoms";
import {
    Grid,
    makeStyles,
} from "@material-ui/core";

export const WB_TOOLBAR_MAX_HEIGHT = 80; // 64 + 16(padding top)

const useStyles = makeStyles(() => ({
    root: {
        position: `relative`,
        height: WB_TOOLBAR_MAX_HEIGHT
    },
    buttonWrap: {
        position: `absolute`,
        zIndex: 999,
        bottom: 10,
        left: 10,
        paddingTop: `15px`
    },
}));

export function WBToolbarContainer({ useLocalDisplay } : { useLocalDisplay?: boolean} ) {
    const classes = useStyles();
    const canvasRef = React.useRef<any>();
    const [ isCanvasOpen, setIsCanvasOpen ] = useRecoilState(isCanvasOpenState);

    const {
        classtype, isTeacher, sessionId,
    } = useContext(LocalSessionContext);
    const {
        state: { display, permissions, localDisplay }, actions: {
            setDisplay, setLocalDisplay, getPermissions, setPermissions,
        },
    } = useSynchronizedState();

    const enableWB = classtype === ClassType.LIVE ? (!isTeacher ? display && permissions.allowCreateShapes : display) : true;

    const handleToggleWBToolbar = () => {
        setIsCanvasOpen(!isCanvasOpen);

        if (useLocalDisplay) {
            setLocalDisplay(!localDisplay);
        } else if (classtype !== ClassType.LIVE) {
            setDisplay(!display);
        }

        if (classtype !== ClassType.LIVE) {
            const permissions = getPermissions(sessionId);
            const newPermissions = {
                ...permissions,
                allowCreateShapes: !permissions.allowCreateShapes,
            };
            setPermissions(sessionId, newPermissions);
        }

    };

    return (
        <Grid
            item
            xs={12}
            className={classes.root}>
            <div ref={canvasRef}
                 className={classes.buttonWrap}>
                <Fab
                    aria-label="whiteboard toolbar opener"
                    disabled={!enableWB}
                    size="large"
                    color="primary"
                    onClick={handleToggleWBToolbar}
                    style={{
                        backgroundColor:`#bd6dd6`   
                    }}
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