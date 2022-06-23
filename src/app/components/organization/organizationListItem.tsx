import { ListOrientation } from "./organizationList";
import { ReadOrganizationDto } from "@/app/data/user/dto/readOrganizationDto";
import {
    COLOR_ORG_ICON_DEFAULT,
    TEXT_COLOR_SECONDARY_DEFAULT,
    THEME_COLOR_PRIMARY_SELECT_DIALOG,
} from "@/config";
import { OrganizationAvatar } from "@kl-engineering/kidsloop-px";
import {
    ButtonBase,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
} from "@material-ui/core";
import {
    makeStyles,
    useTheme,
} from "@material-ui/core/styles";
import { KeyboardArrowRight as ArrowRight } from "@styled-icons/material-rounded/KeyboardArrowRight";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3, 3.5, 0),
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
        flexDirection: `column`,
    },
    orgName: {
        textAlign: `center`,
        paddingTop: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium as number,
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,
        display: `-webkit-box`,
        overflow: `hidden`,
        WebkitBoxOrient: `vertical`,
        WebkitLineClamp: 3,
        [theme.breakpoints.down(`sm`)]: {
            fontSize: `1.15rem`,
        },
    },
    fontWeightBold: {
        fontWeight: theme.typography.fontWeightBold as number,
    },
    orgAvatar: {
        border: `solid 3px transparent`,
        borderRadius: `${theme.spacing(1.5)}px !important`,

        [theme.breakpoints.down(`xs`)]: {
            width: `50px !important`,
            height: `50px !important`,
            fontSize: `12px !important`,
        },
    },
    orgAvatarSelected: {
        border: `solid 6px ${THEME_COLOR_PRIMARY_SELECT_DIALOG}`,
    },
    verticalRoot: {
        padding: theme.spacing(3),
        paddingRight: 0,
        borderRadius: theme.spacing(2),
        backgroundColor: theme.palette.common.white,
        marginBottom: theme.spacing(1),
        "&:hover": {
            backgroundColor: theme.palette.common.white,
        },
        [theme.breakpoints.up(`sm`)]: {
            marginBottom: theme.spacing(3),
            padding: theme.spacing(3),
        },
    },
    listItem: {
        marginLeft: theme.spacing(2),
        color: TEXT_COLOR_SECONDARY_DEFAULT,
    },
    listItemSelected: {
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,
    },
    icon: {
        color: COLOR_ORG_ICON_DEFAULT,
        margin: `0 auto`,
    },
    iconSelected: {
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,
    },
}));
interface Props {
    organization: ReadOrganizationDto;
    isSelected?: boolean;
    onClick?: (organization: ReadOrganizationDto) => void;
    orientation?: ListOrientation;
}

export const OrganizationListItem: React.FC<Props> = ({
    organization, isSelected, onClick, orientation = ListOrientation.HORIZONTAL,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up(`sm`));

    if(orientation === ListOrientation.HORIZONTAL){
        return (
            <ButtonBase
                className={classes.root}
                onClick={() => onClick?.(organization)}
            >
                <OrganizationAvatar
                    className={clsx(classes.orgAvatar, {
                        [classes.orgAvatarSelected]: isSelected,
                    })}
                    name={organization.organization_name ?? ``}
                    size="large"
                />
                <ListItemText
                    primary={organization.organization_name ?? ``}
                    primaryTypographyProps={{
                        className: clsx(classes.orgName, {
                            [classes.fontWeightBold]: isSelected,
                        }),
                        variant: `h5`,
                    }}
                />
            </ButtonBase>
        );
    }

    return (
        <ListItem
            button
            className={classes.verticalRoot}
            onClick={() => onClick?.(organization)}
        >
            <ListItemAvatar>
                <OrganizationAvatar
                    size="large"
                    name={organization.organization_name ?? ``}
                    className={classes.orgAvatar}
                />
            </ListItemAvatar>
            <ListItemText
                primary={organization.organization_name}
                primaryTypographyProps={{
                    className: clsx(classes.listItem, {
                        [classes.listItemSelected]: isSelected,
                    }),
                    variant: isSmUp ? `h5` : `h6`,
                }}
            />
            <ListItemIcon>
                <ArrowRight
                    className={clsx(classes.icon, {
                        [classes.iconSelected]: isSelected,
                    })}
                    size={42}
                />
            </ListItemIcon>
        </ListItem>
    );
};
