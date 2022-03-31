import { ReadUserDto } from "@/app/data/user/dto/readUserDto";
import {
    THEME_COLOR_INACTIVE_BUTTON,
    THEME_COLOR_PRIMARY_SELECT_DIALOG,
} from "@/config";
import {
    Grid,
    ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import React,
{ useMemo } from "react";
import { useIntl } from "react-intl";

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
    },
    divider: {
        margin: theme.spacing(0, 2),
    },
    checkIcon: {
        color: theme.palette.success.main,
        margin: `0 auto`,
    },
    profileName: {
        textAlign: `center`,
        paddingTop: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium as number,
        color: THEME_COLOR_INACTIVE_BUTTON,
        display: `-webkit-box`,
        overflow: `hidden`,
        WebkitBoxOrient: `vertical`,
        WebkitLineClamp: 2,
        [theme.breakpoints.down(`sm`)]: {
            fontSize: `1rem`,
        },
    },
    listItemSelected: {
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,
        fontWeight: theme.typography.fontWeightBold as number,
    },
    userAvatar: {
        border: `solid 3px transparent`,
        borderRadius: 70,
        [theme.breakpoints.up(`sm`)]: {
            width: `100px !important`,
            height: `100px !important`,
        },
    },
    userAvatarSelected: {
        border: `solid 3px ${THEME_COLOR_PRIMARY_SELECT_DIALOG}`,
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
            <Grid
                container
                className={classes.root}
                direction="column"
                justifyContent="center"
                alignItems="center"
                onClick={() => onClick?.(user)}
            >
                <Grid item>
                    <UserAvatar
                        className={clsx(classes.userAvatar, {
                            [classes.userAvatarSelected]: isSelected,
                        })}
                        name={displayName ?? ``}
                        size="large"
                    />
                </Grid>
                <Grid item>
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
                </Grid>
            </Grid>
        </>
    );
};
