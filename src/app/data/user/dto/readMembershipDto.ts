import { ReadOrganizationDto } from "./readOrganizationDto";
import { ReadRoleDto } from "./readRoleDto";

export enum MembershipStatus {
    ACTIVE = `active`,
    INACTIVE = `inactive`
}

export interface ReadMembershipDto {
    organization_id: string;
    organization?: ReadOrganizationDto;
    status?: MembershipStatus;
    roles?: ReadRoleDto[];
}
