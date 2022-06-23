import { ReadUserDto } from "@/app/data/user/dto/readUserDto";
import { THEME_COLOR_PRIMARY_SELECT_DIALOG } from "@/config";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import {
    ButtonBase,
    ListItemText,
    makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{ useMemo } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3, 3.5, 0),
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        flexDirection: `column`,
    },
    profileName: {
        textAlign: `center`,
        paddingTop: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium as number,
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,
        display: `-webkit-box`,
        overflow: `hidden`,
        WebkitBoxOrient: `vertical`,
        WebkitLineClamp: 3,
        maxWidth: 110,
        [theme.breakpoints.down(`sm`)]: {
            fontSize: `1.15rem`,
        },
    },
    listItemSelected: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    userAvatar: {
        border: `solid 3px transparent`,
        borderRadius: 70,
        [theme.breakpoints.up(`sm`)]: {
            width: `110px !important`,
            height: `110px !important`,
        },
    },
    userAvatarSelected: {
        border: `solid 6px ${THEME_COLOR_PRIMARY_SELECT_DIALOG}`,
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
            return intl.formatMessage({
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
        <ButtonBase
            className={classes.root}
            onClick={() => onClick?.(user)}
        >
            <UserAvatar
                className={clsx(classes.userAvatar, {
                    [classes.userAvatarSelected]: isSelected,
                })}
                name={displayName ?? ``}
                size="large"
            />
            <ListItemText
                primary={displayName ?? ``}
                secondary={subTitle}
                primaryTypographyProps={{
                    className: clsx(classes.profileName, {
                        [classes.listItemSelected]: isSelected,
                    }),
                    variant: `h5`,
                }}
            />
        </ButtonBase>
    );
};
