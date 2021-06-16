import StyledIcon from "../../../components/styled/icon";
import { ClassType } from "../../../store/actions";
import { LocalSessionContext } from "../../providers/providers";
import { useSynchronizedState } from "../../whiteboard/context-providers/SynchronizedStateProvider";
import Fab from "@material-ui/core/Fab";
import { PencilAlt as WBIcon } from "@styled-icons/fa-solid/PencilAlt";
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
        state: { display, permissions }, actions: {
            setDisplay, setLocalDisplay, getPermissions, setPermissions,
        },
    } = useSynchronizedState();

    const enableWB = classtype === ClassType.LIVE ? (!isTeacher ? display && permissions.allowCreateShapes : display) : true;

    const handleOpenWBToolbar = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (useLocalDisplay) {
            setLocalDisplay(true);
        } else if (classtype !== ClassType.LIVE) {
            setDisplay(true);
        }

        if (classtype !== ClassType.LIVE) {
            setIsCanvasOpen(!isCanvasOpen);
            setDisplay(!display);
            const permissions = getPermissions(sessionId);
            const newPermissions = {
                ...permissions,
                allowCreateShapes: true,
            };
            setPermissions(sessionId, newPermissions);
        }
    };
    const handleCloseWBToolbar = () => {
        if (useLocalDisplay) {
            setLocalDisplay(false);
        } else if (classtype !== ClassType.LIVE) {
            setDisplay(false);
        }
        
        if (classtype !== ClassType.LIVE) {
            setDisplay(false);
            const permissions = getPermissions(sessionId);
            const newPermissions = {
                ...permissions,
                allowCreateShapes: false,
            };
            setPermissions(sessionId, newPermissions);
        }
    };

    useEffect(() => {
        display && setIsCanvasOpen(permissions.allowCreateShapes);
        !display && setIsCanvasOpen(false);
    }, [ display, permissions.allowCreateShapes ]);

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
                    onClick={handleOpenWBToolbar}
                >
                    <StyledIcon
                        icon={<WBIcon />}
                        size="large"
                        color="white" />
                </Fab>
            </div>
            <CanvasMenu anchor={canvasRef.current} />
        </Grid>
    );
}
