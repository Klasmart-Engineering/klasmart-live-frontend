import React, { ReactChild, ReactChildren, useCallback, useContext, useState } from "react";
import { gql } from "apollo-boost";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid/Grid";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { Permissions, createEmptyPermissions } from "../types/Permissions";
import { useWhiteboard } from "../context-provider/WhiteboardContextProvider";
import { UserContext } from "../../entry";

import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";
import { InvertColors as InvertColorsIcon } from "@styled-icons/material/InvertColors";
import { InvertColorsOff as InvertColorsOffIcon } from "@styled-icons/material/InvertColorsOff";

import StyledIcon from "../../components/styled/icon";

const WHITEBOARD_SEND_PERMISSIONS = gql`
  mutation whiteboardSendPermissions($roomId: ID!, $userId: ID!, $permissions: String) {
      whiteboardSendPermissions(roomId: $roomId, userId: $userId, permissions: $permissions)
  }
`;

const SUBSCRIBE_WHITEBOARD_PERMISSIONS = gql`
  subscription whiteboardPermissions($roomId: ID! $userId: ID!) {
      whiteboardPermissions(roomId: $roomId, userId: $userId)
  }`;

type Props = {
    children?: ReactChild | ReactChildren | null
    selfUserId: string
    otherUserId: string
    miniMode?: boolean
}

export default function PermissionControls({ children, selfUserId, otherUserId, miniMode }: Props): JSX.Element {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const [sendPermissionsMutation] = useMutation(WHITEBOARD_SEND_PERMISSIONS);
    const [otherUserPermissions, setOtherUserPermissions] = useState<Permissions>(createEmptyPermissions());

    const { roomId } = useContext(UserContext);
    const { actions: { clear } } = useWhiteboard();

    useSubscription(SUBSCRIBE_WHITEBOARD_PERMISSIONS, {
        onSubscriptionData: ({ subscriptionData: { data: { whiteboardPermissions } } }) => {
            if (whiteboardPermissions) {
                setOtherUserPermissions(JSON.parse(whiteboardPermissions as string));
            }
        }, variables: { roomId, userId: otherUserId }
    });

    const toggleAllowCreateShapes = useCallback(() => {
        const newPermissions = {
            ...otherUserPermissions,
            allowCreateShapes: !otherUserPermissions.allowCreateShapes,
        };

        setOtherUserPermissions(newPermissions);

        sendPermissionsMutation({
            variables: {
                roomId, userId: otherUserId, permissions: JSON.stringify(newPermissions)
            }
        });
    }, [otherUserPermissions, sendPermissionsMutation, otherUserId]);

    const clearUserWhiteboard = useCallback(() => {
        clear(otherUserId);
    }, [otherUserId]);

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
                        {otherUserPermissions.allowCreateShapes
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
                        icon={otherUserPermissions.allowCreateShapes ? <InvertColorsIcon /> : <InvertColorsOffIcon />}
                        size="medium"
                        color={otherUserPermissions.allowCreateShapes ? "#0E78D5" : "#dc004e"}
                    />
                </ListItemIcon>
                <ListItemText primary={otherUserPermissions.allowCreateShapes ? "Disallow drawing" : "Allow drawing"} />
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