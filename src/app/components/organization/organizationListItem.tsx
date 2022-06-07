import { ReadOrganizationDto } from "@/app/data/user/dto/readOrganizationDto";
import { THEME_COLOR_PRIMARY_SELECT_DIALOG } from "@/config";
import { OrganizationAvatar } from "@kl-engineering/kidsloop-px";
import {
    Box,
    ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import React from "react";

const useStyles = makeStyles((theme) => ({
    root: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
        margin: theme.spacing(0, 3.5),
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
    listItemSelected: {
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
        border: `solid 3px ${THEME_COLOR_PRIMARY_SELECT_DIALOG}`,
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

    return (
        <Box
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
                        [classes.listItemSelected]: isSelected,
                    }),
                    variant: `h5`,
                }}
            />
        </Box>
    );
};
