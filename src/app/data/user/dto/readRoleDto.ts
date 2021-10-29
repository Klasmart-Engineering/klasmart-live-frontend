
export enum RoleStatus {
    ACTIVE = `active`,
    INACTIVE = `inactive`,
}

export interface ReadRoleDto {
    role_id: string;
    role_name?: string;
    status: RoleStatus;
}
