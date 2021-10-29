import { ReadOrganizationDto } from "@/app/data/user/dto/readOrganizationDto";
import {
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
} from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import { Check as CheckIcon } from "@styled-icons/fa-solid/Check";
import { OrganizationAvatar } from "kidsloop-px";
import React from "react";

interface Props {
    organization: ReadOrganizationDto;
    isSelected?: boolean;
    onClick?: (organization: ReadOrganizationDto) => void;
}

export const OrganizationListItem: React.FC<Props> = ({
    organization, isSelected, onClick,
}) => {
    const theme = useTheme();

    return (
        <ListItem
            button
            onClick={onClick ? () => onClick(organization) : undefined}
        >
            <ListItemAvatar>
                <OrganizationAvatar name={organization.organization_name ?? ``} />
            </ListItemAvatar>
            <ListItemText
                primary={organization.organization_name}
            />
            { isSelected && (
                <ListItemIcon>
                    <CheckIcon
                        color={theme.palette.success.main}
                        size={24} />
                </ListItemIcon>
            )}
        </ListItem>
    );
};
