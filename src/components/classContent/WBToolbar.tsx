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
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

    const { classtype, teacher, sessionId } = useContext(UserContext);
    const { state: { display, permissions }, actions: { setDisplay, getPermissions, setPermissions } } = useSynchronizedState();
    const enableWB = classtype === ClassType.LIVE ? (!teacher ? display && permissions.allowCreateShapes : display) : true;
    const [open, setOpen] = useState(false);

    const handleOpenWBToolbar = (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(true);
        if (classtype !== ClassType.LIVE) {
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
        if (classtype !== ClassType.LIVE) {
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
        <Grid item xs={12} style={{ position: "relative", height: WB_TOOLBAR_MAX_HEIGHT }}>
            <Fab
                aria-label="whiteboard toolbar opener"
                disabled={!enableWB}
                onClick={handleOpenWBToolbar}
                size="large"
                color="primary"
                style={{
                    display: open ? "none" : "flex",
                    zIndex: WB_EXPAND_BUTTON,
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                }}
            >
                <StyledIcon icon={<WBIcon />} size="large" color="white" />
            </Fab>
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
                            size={"medium"}
                            style={{ backgroundColor: theme.palette.background.paper }}
                            onClick={handleCloseWBToolbar}
                        >
                            <StyledIcon icon={teacher ? <ArrowDownIcon /> : <CloseIcon />} size="large" />
                        </IconButton>
                    </Grid>
                    <WBToolbar />
                </Grid>
            </Paper>
        </Grid>
    )
}