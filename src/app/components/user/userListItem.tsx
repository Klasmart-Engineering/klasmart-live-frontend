import { ReadUserDto } from "@/app/data/user/dto/readUserDto";
import {
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { Check as CheckIcon } from "@styled-icons/fa-solid/Check";
import { UserAvatar } from "kidsloop-px";
import React,
{ useMemo } from "react";
import { useIntl } from "react-intl";

interface Props {
    user: ReadUserDto;
    isSelected?: boolean;
    onClick?: (user: ReadUserDto) => void;
}

export const UserListItem: React.FC<Props> = ({
    user, isSelected, onClick,
}) => {
    const theme = useTheme();
    const intl = useIntl();

    const displayName = useMemo(() => {
        if (user.given_name && user.family_name) {
            // TODO: Localize full name ordering
            // e.g.
            // - EU: <givenName> <familyName>
            // - KR: <familyName> <givenName>
            return `${user.given_name} ${user.family_name}`;
        } else {
            return user.username;
        }
    }, [ user ]);

    const subTitle = useMemo(() => {
        if (!displayName) {
            return  intl.formatMessage({
                id: `selectUser.updateProfile`,
            });
        }

        // TODO: Localize date/time formatting
        return user.date_of_birth ? intl.formatMessage({
            id: `selectUser.birthday`,
        }, {
            date: user.date_of_birth,
        }) : ``;
    }, [ user, displayName ]);

    return (
        <ListItem
            button
            onClick={onClick ? () => onClick(user) : undefined}
        >
            <ListItemAvatar>
                <UserAvatar name={displayName ?? ``} />
            </ListItemAvatar>
            <ListItemText
                primary={displayName ?? ``}
                secondary={subTitle}
            />
            {isSelected && (
                <ListItemIcon>
                    <CheckIcon
                        color={theme.palette.success.main}
                        size={24} />
                </ListItemIcon>
            )}
        </ListItem>);
};
