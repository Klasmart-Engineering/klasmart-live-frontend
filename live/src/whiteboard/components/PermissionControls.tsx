import React, { ReactChild, ReactChildren, useCallback, useContext, useState } from "react";
import { gql } from "apollo-boost";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid/Grid";
import IconButton from "@material-ui/core/IconButton";
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import InvertColorsOffIcon from '@material-ui/icons/InvertColorsOff';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import { Permissions, createEmptyPermissions } from "../types/Permissions";
import { useWhiteboard } from "../context-provider/WhiteboardContextProvider";
import { UserContext } from "../../entry";

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
    otherUserId: string
}

export default function PermissionControls({ children, otherUserId }: Props): JSX.Element {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const [sendPermissionsMutation] = useMutation(WHITEBOARD_SEND_PERMISSIONS);
    const [otherUserPermissions, setOtherUserPermissions] = useState<Permissions>(createEmptyPermissions());

    const { roomId } = useContext(UserContext);
    const { actions: { clearOther } } = useWhiteboard();

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
        clearOther(otherUserId);
    }, [otherUserId]);

    return (
        <Grid container justify="space-evenly" alignItems="center">
            <Grid item>
                <IconButton
                    aria-label="control canvas permission"
                    component="span"
                    onClick={toggleAllowCreateShapes}
                    size="small"
                >
                    {otherUserPermissions.allowCreateShapes
                        ? <InvertColorsIcon color="primary" fontSize={isSmDown ? "small" : "inherit"} />
                        : <InvertColorsOffIcon color="primary" fontSize={isSmDown ? "small" : "inherit"} />
                    }
                </IconButton>
            </Grid>
            <Grid item>
                <IconButton
                    aria-label="control canvas permission"
                    component="span"
                    onClick={clearUserWhiteboard}
                    size="small"
                >
                    <ClearAllIcon color="primary" fontSize={isSmDown ? "small" : "inherit"} />
                </IconButton>
            </Grid>
            {children}
        </Grid>
    );
}