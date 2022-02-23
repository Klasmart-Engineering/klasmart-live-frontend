import { ReadOrganizationDto } from "@/app/data/user/dto/readOrganizationDto";
import {
    Divider,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Check as CheckIcon } from "@styled-icons/bootstrap/Check";
import clsx from "clsx";
import { OrganizationAvatar } from "@kl-engineering/kidsloop-px";
import React from "react";

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
    organization: ReadOrganizationDto;
    isSelected?: boolean;
    onClick?: (organization: ReadOrganizationDto) => void;
}

export const OrganizationListItem: React.FC<Props> = ({
    organization, isSelected, onClick,
}) => {
    const classes = useStyles();

    return (
        <>
            <ListItem
                button
                className={classes.root}
                onClick={() => onClick?.(organization)}
            >
                <ListItemAvatar>
                    <OrganizationAvatar name={organization.organization_name ?? ``} />
                </ListItemAvatar>
                <ListItemText
                    primary={organization.organization_name}
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
