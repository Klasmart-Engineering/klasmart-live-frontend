import { useMutation, useSubscription } from "@apollo/react-hooks";
import Button from "@material-ui/core/Button";
import { gql } from "apollo-boost";
import React, { ReactChild, ReactChildren, useCallback, useContext, useState } from "react";
import { UserContext } from "../../entry";
import { Permissions, createEmptyPermissions } from "../types/Permissions";
import Grid from "@material-ui/core/Grid/Grid";
import { useWhiteboard } from "../context-provider/WhiteboardContextProvider";

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
                <Button onClick={() => toggleAllowCreateShapes()}>{otherUserPermissions.allowCreateShapes ? "[P]" : "[X]"}</Button>
            </Grid>
            <Grid item>
                <Button onClick={() => clearUserWhiteboard()}>{"[C]"}</Button>
            </Grid>
            {children}
        </Grid>
    );
}