import { EntityStatus, Class } from "./sharedDto";

export interface ReadUserDto {
    user_id: string;
    username?: string;
    given_name?: string;
    family_name?: string;
    date_of_birth?: string;
    organizationsWithPermission: {
        status: EntityStatus;
        roles: Role[];
        organization: {
            organization_id: string;
            organization_name: string;
        };
    }[];
    classesStudying?: Class[];
}

interface Role {
    role_name: string;
}
