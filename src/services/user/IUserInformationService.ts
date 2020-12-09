
// TODO (Axel): It would be great to get rid of the dependency
// of these implementation specific response types from 
// the interface.

export type OrganizationResponse = {
    organization_id: string,
    organization_name: string,
    owner?: { email: string }
}

export type RoleResponse = {
    role_id: string,
    role_name: string
}

export type ClassResponse = {
    class_id: string,
    class_name: string,
    organization: OrganizationResponse
}

export type Organization = {
    organization: OrganizationResponse,
    roles: RoleResponse[]
}

export type UserInformation = {
    id: string,
    email: string,
    name: string,
    givenName: string,
    familyName: string,
    avatar: string,
    organizations: Organization[],
    classes: ClassResponse[],
}

export interface IUserInformationService {
    me(): Promise<UserInformation>;
}