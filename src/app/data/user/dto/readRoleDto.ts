import { EntityStatus } from "./sharedDto";

export interface ReadRoleDto {
    role_id: string;
    role_name?: string;
    status: EntityStatus;
}
