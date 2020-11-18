import React, { ReactChild, ReactChildren, useCallback } from "react";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid/Grid";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";
import { InvertColors as InvertColorsIcon } from "@styled-icons/material/InvertColors";
import { InvertColorsOff as InvertColorsOffIcon } from "@styled-icons/material/InvertColorsOff";

import StyledIcon from "../../components/styled/icon";

import { useSynchronizedState } from "../context-providers/SynchronizedStateProvider";
import { useToolbarContext } from "kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";

type Props = {
    children?: ReactChild | ReactChildren | null
    selfUserId: string
    otherUserId: string
    miniMode?: boolean
}

export default function PermissionControls({ children, selfUserId, otherUserId, miniMode }: Props): JSX.Element {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const { state: { display }, actions: { setDisplay, setPermissions, getPermissions } } = useSynchronizedState();
    const { actions: { clear } } = useToolbarContext();

    const permissions = getPermissions(otherUserId);

    const toggleAllowCreateShapes = useCallback(() => {
        const newPermissions = {
            ...permissions,
            allowCreateShapes: !permissions.allowCreateShapes,
        };
        setPermissions(otherUserId, newPermissions)

    }, [permissions, setPermissions, otherUserId]);

    const toggleDisplay = useCallback(() => {
        const newDisplay = !display;
        setDisplay(newDisplay);
    }, [display, setDisplay]);

    const clearUserWhiteboard = useCallback(() => {
        clear([otherUserId]);
    }, [otherUserId, clear]);

    return (miniMode ?
        <Grid container justify="space-evenly" alignItems="center" item xs={6}>
            {selfUserId !== otherUserId ?
                <Grid item>
                    <IconButton
                        aria-label="control canvas permission"
                        component="span"
                        onClick={toggleAllowCreateShapes}
                        size="small"
                    >
                        {permissions.allowCreateShapes
                            ? <InvertColorsIcon size={isSmDown ? "1rem" : "1.25rem"} color="#0E78D5" />
                            : <InvertColorsOffIcon size={isSmDown ? "1rem" : "1.25rem"} color="#F44336" />
                        }
                    </IconButton>
                </Grid>
                : <></>
            }
            <Grid item>
                <IconButton
                    aria-label="control canvas permission"
                    component="span"
                    onClick={clearUserWhiteboard}
                    size="small"
                >
                    <EraserIcon size={isSmDown ? "1rem" : "1.25rem"} color="#0E78D5" />
                </IconButton>
            </Grid>
            {children}
        </Grid> : <>
            <MenuItem onClick={toggleAllowCreateShapes}>
                <ListItemIcon>
                    <StyledIcon
                        icon={permissions.allowCreateShapes ? <InvertColorsIcon /> : <InvertColorsOffIcon />}
                        size="medium"
                        color={permissions.allowCreateShapes ? "#0E78D5" : "#dc004e"}
                    />
                </ListItemIcon>
                <ListItemText primary={permissions.allowCreateShapes ? "Disallow drawing" : "Allow drawing"} />
            </MenuItem>
            <MenuItem onClick={clearUserWhiteboard}>
                <ListItemIcon>
                    <StyledIcon icon={<EraserIcon />} size={"medium"} color="#0E78D5" />
                </ListItemIcon>
                <ListItemText primary="Clear Whiteboard" />
            </MenuItem>
        </>
    );
}