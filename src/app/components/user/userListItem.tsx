import { ReadUserDto } from "@/app/data/user/dto/readUserDto";
import {
    SCHEDULE_BLACK_TEXT,
    THEME_COLOR_PRIMARY_SELECT_DIALOG,
} from "@/config";
import { UserAvatar } from "@kl-engineering/kidsloop-px";
import {
    ButtonBase,
    ListItemText,
    makeStyles,
} from "@material-ui/core";
import clsx from "clsx";
import React,
{ useMemo } from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(1, 3.5),
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        flexDirection: `column`,
        [theme.breakpoints.up(`md`)]: {
            padding: theme.spacing(2, 7),
        },
    },
    profileName: {
        textAlign: `center`,
        paddingTop: theme.spacing(0.5),
        fontWeight: theme.typography.fontWeightMedium as number,
        color: SCHEDULE_BLACK_TEXT,
        overflow: `hidden`,
        whiteSpace: `nowrap`,
        textOverflow: `ellipsis`,
        width: 150,
        fontSize: `1.15rem`,
        [theme.breakpoints.up(`md`)]: {
            width: 200,
        },
    },
    listItemSelected: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    userAvatar: {
        border: `solid 3px transparent`,
        borderRadius: 70,
        width: `72px !important`,
        height: `72px !important`,
        [theme.breakpoints.up(`md`)]: {
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
    const classes = useStyles();

    const maxLengthName = (name: string) => {
        if (name.length > 20) {
            return `${name.slice(0, 20)}...`;
        }
        return name;
    };

    const displayName = useMemo(() => {
        if (user.given_name && user.family_name) {
            // TODO: Localize full name ordering
            // e.g.
            // - EU: <givenName> <familyName>
            // - KR: <familyName> <givenName>
            return maxLengthName(`${user.given_name} ${user.family_name}`);
        } else {
            return user.username;
        }
    }, [ user ]);

    return (
        <ButtonBase
            className={classes.root}
            onClick={() => onClick?.(user)}
        >
            <UserAvatar
                maxInitialsLength={2}
                className={clsx(classes.userAvatar, {
                    [classes.userAvatarSelected]: isSelected,
                })}
                name={displayName ?? ``}
                size="large"
            />
            <ListItemText
                primary={displayName ?? ``}
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
