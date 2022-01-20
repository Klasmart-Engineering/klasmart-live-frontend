import { ReadUserDto } from "@/app/data/user/dto/readUserDto";
import {
    Divider,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import {
    makeStyles,
    useTheme,
} from "@material-ui/core/styles";
import { Check as CheckIcon } from "@styled-icons/bootstrap/Check";
import clsx from "clsx";
import { UserAvatar } from "kidsloop-px";
import React,
{ useMemo } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
    },
    listItemSelected: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    divider: {
        margin: theme.spacing(0, 2),
    },
    checkIcon: {
        color: theme.palette.success.main,
        margin: `0 auto`,
    },
}));

interface Props {
    user: ReadUserDto;
    isSelected?: boolean;
    onClick?: (user: ReadUserDto) => void;
}

export const UserListItem: React.FC<Props> = ({
    user, isSelected, onClick,
}) => {
    const intl = useIntl();
    const classes = useStyles();

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
        <>
            <ListItem
                button
                className={classes.root}
                onClick={() => onClick?.(user)}
            >
                <ListItemAvatar>
                    <UserAvatar name={displayName ?? ``} />
                </ListItemAvatar>
                <ListItemText
                    primary={displayName ?? ``}
                    secondary={subTitle}
                    primaryTypographyProps={{
                        className: clsx({
                            [classes.listItemSelected] : isSelected,
                        }),
                    }}
                />
                {isSelected &&
                    <ListItemIcon>
                        <CheckIcon
                            className={classes.checkIcon}
                            size={36} />
                    </ListItemIcon>
                }
            </ListItem>
            <Divider className={classes.divider} />
        </>
    );
};
