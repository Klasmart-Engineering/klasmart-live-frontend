import StyledIcon from "../../../components/styled/icon";
import { ClassType } from "../../../store/actions";
import { WB_EXPAND_BUTTON, WB_TOOLBAR } from "../../../utils/layerValues";
import { LocalSessionContext } from "../../providers/providers";
import WBToolbar from "../../whiteboard/components/Toolbar-new"; // TODO: Change Toolbar-new to Toolbar
import { useSynchronizedState } from "../../whiteboard/context-providers/SynchronizedStateProvider";
import Fab from "@material-ui/core/Fab";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { PencilAlt as WBIcon } from "@styled-icons/fa-solid/PencilAlt";
import { Close as CloseIcon } from "@styled-icons/material/Close";
import { ExpandLess as ArrowUpIcon } from "@styled-icons/material/ExpandLess";
import { ExpandMore as ArrowDownIcon } from "@styled-icons/material/ExpandMore";
import React, { useContext, useState } from "react";

export const WB_TOOLBAR_MAX_HEIGHT = 80; // 64 + 16(padding top)
export const MOBILE_WB_TOOLBAR_MAX_HEIGHT = 46; // 38 + 8(padding top)

export function WBToolbarContainer () {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const {
        classtype, isTeacher, sessionId,
    } = useContext(LocalSessionContext);
    const {
        state: { display, permissions }, actions: {
            setDisplay, getPermissions, setPermissions,
        },
    } = useSynchronizedState();
    const enableWB = classtype === ClassType.LIVE ? (!isTeacher ? display && permissions.allowCreateShapes : display) : true;
    const [ open, setOpen ] = useState(false);

    const handleOpenWBToolbar = (e: React.MouseEvent<HTMLButtonElement>) => {
        setOpen(true);
        if (classtype !== ClassType.LIVE) {
            setDisplay(true);
            const permissions = getPermissions(sessionId);
            const newPermissions = {
                ...permissions,
                allowCreateShapes: true,
            };
            setPermissions(sessionId, newPermissions);
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
            setPermissions(sessionId, newPermissions);
        }
    };
    return (
        <Grid
            item
            xs={12}
            style={{
                position: `relative`,
                height: WB_TOOLBAR_MAX_HEIGHT,
            }}>
            <Fab
                aria-label="whiteboard toolbar opener"
                disabled={!enableWB}
                size="large"
                style={{
                    display: open ? `none` : `flex`,
                    backgroundColor:`#bd6dd6`,
                    zIndex: WB_EXPAND_BUTTON,
                    position: `absolute`,
                    bottom: 10,
                    left: 10,
                }}
                onClick={handleOpenWBToolbar}
            >
                <StyledIcon
                    icon={<WBIcon />}
                    size="large"
                    color="white" />
            </Fab>
            <Paper
                aria-label="whiteboard toolbar"
                elevation={2}
                style={{
                    zIndex: WB_TOOLBAR,
                    display: open ? `flex` : `none`,
                    padding: isSmDown ? theme.spacing(0.5) : theme.spacing(1),
                    width: `calc(100% - 20px)`,
                    position: `absolute`,
                    bottom: 5,
                    borderRadius: 32,
                    overflowY: `hidden`,
                }}
            >
                <Grid
                    container
                    direction="row"
                    justify="space-between"
                    alignItems="center">
                    <Grid
                        item
                        style={{
                            flex: 0,
                        }}>
                        <IconButton
                            size={`medium`}
                            style={{
                                backgroundColor: theme.palette.background.paper,
                            }}
                            onClick={handleCloseWBToolbar}
                        >
                            <StyledIcon
                                icon={isTeacher ? <ArrowDownIcon /> : <CloseIcon />}
                                size="large" />
                        </IconButton>
                    </Grid>
                    <WBToolbar />
                </Grid>
            </Paper>
        </Grid>
    );
}
