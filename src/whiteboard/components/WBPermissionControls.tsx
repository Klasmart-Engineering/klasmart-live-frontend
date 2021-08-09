import StyledIcon from "../../components/styled/icon";
import { useSynchronizedState } from "../context-providers/SynchronizedStateProvider";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import { Eraser as EraserIcon } from "@styled-icons/boxicons-solid/Eraser";
import { InvertColors as InvertColorsIcon } from "@styled-icons/material/InvertColors";
import { InvertColorsOff as InvertColorsOffIcon } from "@styled-icons/material/InvertColorsOff";
import { useToolbarContext } from "kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";
import React,
{ useCallback } from "react";
import { FormattedMessage } from "react-intl";

export default function PermissionControls ({ otherUserId }: { otherUserId: string }): JSX.Element {
    const { actions: { setPermissions, getPermissions } } = useSynchronizedState();
    const { actions: { clear } } = useToolbarContext();

    const permissions = getPermissions(otherUserId);

    const toggleAllowCreateShapes = useCallback(() => {
        const newPermissions = {
            ...permissions,
            allowCreateShapes: !permissions.allowCreateShapes,
        };
        setPermissions(otherUserId, newPermissions);

    }, [
        permissions,
        setPermissions,
        otherUserId,
    ]);

    const clearUserWhiteboard = useCallback(() => {
        clear([ otherUserId ]);
    }, [ otherUserId, clear ]);

    return (<>
        <MenuItem onClick={toggleAllowCreateShapes}>
            <ListItemIcon>
                <StyledIcon
                    icon={permissions.allowCreateShapes ? <InvertColorsIcon /> : <InvertColorsOffIcon />}
                    size="medium"
                    color={permissions.allowCreateShapes ? `#0E78D5` : `#dc004e`}
                />
            </ListItemIcon>
            <ListItemText
                primary={permissions.allowCreateShapes ?
                    <FormattedMessage id="whiteboard_permissionControls_listItemText_disallow" /> :
                    <FormattedMessage id="whiteboard_permissionControls_listItemText_allow" />
                }
            />
        </MenuItem>
        <MenuItem onClick={clearUserWhiteboard}>
            <ListItemIcon>
                <StyledIcon
                    icon={<EraserIcon />}
                    size={`medium`}
                    color="#0E78D5" />
            </ListItemIcon>
            <ListItemText primary={<FormattedMessage id="whiteboard_permissionControls_listItemText_clear" />} />
        </MenuItem>
    </>);
}
