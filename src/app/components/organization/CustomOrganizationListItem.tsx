
import stringToColor from "@/app/utils/stringToColor";
import OrganizationIcon from "@/assets/img/profile-org-selection/white-organization-icon.svg";
import {
    createStyles,
    makeStyles,
} from "@material-ui/core";
import {
    Avatar,
    Tooltip,
    useTheme,
} from "@mui/material";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => createStyles({
    tooltip: {
        display: `inline-block`,
    },
    avatar: {
        color: `white`,
    },
    avatarSmall: {
        width: 30,
        height: 30,
        fontSize: 14,
    },
    avatarMedium: {
        width: 40,
        height: 40,
        fontSize: 18,
    },
    avatarLarge: {
        width: 80,
        height: 80,
        fontSize: 38,
    },
    orgIcon: {
        filter: `invert(1)`,
        width: 30,
        height: 30,
        [theme.breakpoints.up(`md`)]: {
            width: 50,
            height: 50,
        },
    },
}));

const MAX_INITIALS_LENGTH = 1;

export interface Props {
    name: string;
    src?: string;
    maxInitialsLength?: number;
    size?: `small` | `medium` | `large`;
    className?: string;
    color?: string;
}

export default function CustomOrganizationAvatar (props: Props) {
    const {
        name,
        maxInitialsLength = MAX_INITIALS_LENGTH,
        src,
        size = `medium`,
        className,
        color,
    } = props;
    const classes = useStyles();
    const theme = useTheme();

    const backgroundColor = color ?? (name ? stringToColor(name || ``) : theme.palette.primary.main);

    return (
        <Tooltip
            className={classes.tooltip}
            title={name}
        >
            <span>
                <Avatar
                    variant="circular"
                    src={src}
                    className={clsx(classes.avatar, className, {
                        [classes.avatarSmall]: size === `small`,
                        [classes.avatarMedium]: size === `medium`,
                        [classes.avatarLarge]: size === `large`,
                    })}
                    style={{
                        backgroundColor,
                    }}
                >
                    <img
                        alt="organization icon"
                        src={OrganizationIcon}
                        className={classes.orgIcon}
                    />
                </Avatar>
            </span>
        </Tooltip>
    );
}
