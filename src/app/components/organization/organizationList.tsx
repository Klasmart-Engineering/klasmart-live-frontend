import { OrganizationListItem } from "./organizationListItem";
import { ReadOrganizationDto } from "@/app/data/user/dto/readOrganizationDto";
import { List } from "@material-ui/core";
import React from "react";

interface Props {
    organizations: ReadOrganizationDto[];
    selectedOrganization?: ReadOrganizationDto;
    onClick?: (organization: ReadOrganizationDto) => void;
}

export const OrganizationList: React.FC<Props> = ({
    organizations, selectedOrganization, onClick,
}) => {
    return (
        <List>
            {organizations.map((organization) =>
                <OrganizationListItem
                    key={organization.organization_id}
                    organization={organization}
                    isSelected={organization.organization_id === selectedOrganization?.organization_id}
                    onClick={onClick} />)}
        </List>
    );
};
