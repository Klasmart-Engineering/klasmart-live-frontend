import { ReadOrganizationDto } from "@/app/data/user/dto/readOrganizationDto";
import {
    COLOR_ORG_ICON_DEFAULT,
    TEXT_COLOR_SECONDARY_DEFAULT,
    THEME_COLOR_PRIMARY_SELECT_DIALOG,
} from "@/config";
import {
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { KeyboardArrowRight as ArrowRight } from "@styled-icons/material-rounded/KeyboardArrowRight";
import clsx from "clsx";
import { OrganizationAvatar } from "@kl-engineering/kidsloop-px";
import React from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        padding: theme.spacing(3),
        paddingRight: 0,
        borderRadius: theme.spacing(2),
        backgroundColor: theme.palette.common.white,
        marginBottom: theme.spacing(1),
        "&:hover":{
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
        fontWeight: theme.typography.fontWeightBold as number,
    },
    icon: {
        color: COLOR_ORG_ICON_DEFAULT,
        margin: `0 auto`,
    },
    iconSelected: {
        color: THEME_COLOR_PRIMARY_SELECT_DIALOG,
    },
    orgAvatar: {
        borderRadius: `${theme.spacing(1.5)}px !important`,

        [theme.breakpoints.down(`xs`)]: {
            width: `50px !important`,
            height: `50px !important`,
            fontSize: `12px !important`,
        },
    },
}));
interface Props {
    organization: ReadOrganizationDto;
    isSelected?: boolean;
    onClick?: (organization: ReadOrganizationDto) => void;
}

export const OrganizationListItem: React.FC<Props> = ({
    organization, isSelected, onClick,
}) => {
    const classes = useStyles();
    const theme = useTheme();
    const isSmUp = useMediaQuery(theme.breakpoints.up(`sm`));

    return (
        <>
            <ListItem
                button
                className={classes.root}
                onClick={() => onClick?.(organization)}
            >
                <ListItemAvatar>
                    <OrganizationAvatar
                        size="large"
                        name={organization.organization_name ?? ``}
                        className={classes.orgAvatar} />
                </ListItemAvatar>
                <ListItemText
                    primary={organization.organization_name}
                    primaryTypographyProps={{
                        className: clsx(classes.listItem, {
                            [classes.listItemSelected] : isSelected,
                        }),
                        variant: isSmUp ? `h5` : `h6`,
                    }}
                />
                <ListItemIcon>
                    <ArrowRight
                        className={clsx(classes.icon, {
                            [classes.iconSelected]: isSelected,
                        })}
                        size={42} />
                </ListItemIcon>
            </ListItem>
        </>
    );
};
