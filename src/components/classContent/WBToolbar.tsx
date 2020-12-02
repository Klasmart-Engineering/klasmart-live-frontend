import React, { useState, useContext } from "react";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import Paper from "@material-ui/core/Paper";

import { Close as CloseIcon } from "@styled-icons/material/Close";
import { ExpandLess as ArrowUpIcon } from "@styled-icons/material/ExpandLess";
import { ExpandMore as ArrowDownIcon } from "@styled-icons/material/ExpandMore";
import { PencilAlt as WBIcon } from "@styled-icons/fa-solid/PencilAlt";

import StyledIcon from "../styled/icon";
import { UserContext } from "../../entry";
import { useSynchronizedState } from "../../whiteboard/context-providers/SynchronizedStateProvider";
import WBToolbar from "../../whiteboard/components/Toolbar-new"; // TODO: Change Toolbar-new to Toolbar
import { WB_EXPAND_BUTTON, WB_TOOLBAR } from "../../utils/layerValues";
import { ClassType } from "../../store/actions";

export const WB_TOOLBAR_MAX_HEIGHT = 80; // 64 + 16(padding top)
export const MOBILE_WB_TOOLBAR_MAX_HEIGHT = 46; // 38 + 8(padding top)

export function WBToolbarContainer() {
    const TEACHER_FAB_WIDTH = 80;
    const TEACHER_FAB_HEIGHT = 18;

    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

    const { teacher, sessionId, classType } = useContext(UserContext);
    const { state: { display, permissions }, actions: { setDisplay, getPermissions, setPermissions } } = useSynchronizedState();
    const enableWB = classType === ClassType.LIVE ? (!teacher ? display && permissions.allowCreateShapes : display) : true;
    const [open, setOpen] = useState(false);

    const handleOpenWBToolbar = (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(true);
        if (classType !== ClassType.LIVE) {
            setDisplay(true);
            const permissions = getPermissions(sessionId);
            const newPermissions = {
                ...permissions,
                allowCreateShapes: true,
            };
            setPermissions(sessionId, newPermissions)
        }
    };
    const handleCloseWBToolbar = () => {
        setOpen(false);
        if (classType !== ClassType.LIVE) {
            setDisplay(false);
            const permissions = getPermissions(sessionId);
            const newPermissions = {
                ...permissions,
                allowCreateShapes: false,
            };
            setPermissions(sessionId, newPermissions)
        }
    };
    return (
        <Grid item xs={12} style={{ position: "relative", height: isSmDown ? MOBILE_WB_TOOLBAR_MAX_HEIGHT : WB_TOOLBAR_MAX_HEIGHT }}>
            {classType !== ClassType.LIVE || !teacher ? (
                <Fab
                    aria-label="student whiteboard toolbar opener"
                    disabled={!enableWB}
                    onClick={handleOpenWBToolbar}
                    size={isSmDown ? "small" : "large"}
                    color="primary"
                    style={{
                        display: open ? "none" : "flex",
                        zIndex: WB_EXPAND_BUTTON,
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                    }}
                >
                    <StyledIcon icon={<WBIcon />} size={isSmDown ? "small" : "large"} color="white" />
                </Fab>
            ) : (
                    <Fab
                        aria-label="teacher whiteboard toolbar opener"
                        disabled={!enableWB}
                        variant="extended"
                        onClick={handleOpenWBToolbar}
                        size="small"
                        color="primary"
                        style={{
                            zIndex: WB_EXPAND_BUTTON,
                            display: open ? "none" : "flex",
                            width: TEACHER_FAB_WIDTH,
                            height: TEACHER_FAB_HEIGHT,
                            position: "absolute",
                            bottom: 0,
                            left: `calc(50% - ${TEACHER_FAB_WIDTH}px)`,
                        }}
                    >
                        <StyledIcon icon={<ArrowUpIcon />} size="medium" color="white" />
                    </Fab>
                )
            }
            <Paper
                aria-label="whiteboard toolbar"
                elevation={2}
                style={{
                    zIndex: WB_TOOLBAR,
                    display: open ? "flex" : "none",
                    padding: isSmDown ? theme.spacing(0.5) : theme.spacing(1),
                    width: "100%",
                    position: "absolute",
                    bottom: 0,
                    borderRadius: 32,
                    overflowY: "hidden",
                }}
            >
                <Grid container direction="row" justify="space-between" alignItems="center">
                    <Grid item style={{ flex: 0 }}>
                        <IconButton
                            size={isSmDown ? "small" : "medium"}
                            style={{ backgroundColor: theme.palette.background.paper }}
                            onClick={handleCloseWBToolbar}
                        >
                            <StyledIcon icon={teacher ? <ArrowDownIcon /> : <CloseIcon />} size={isSmDown ? "small" : "large"} />
                        </IconButton>
                    </Grid>
                    <WBToolbar />
                </Grid>
            </Paper>
        </Grid>
    )
}