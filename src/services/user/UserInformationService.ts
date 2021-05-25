import { IAuthenticationService } from "../auth/IAuthenticationService";
import { ClassResponse, IUserInformationService, OrganizationResponse, RoleResponse, UserInformation } from "./IUserInformationService";

// TODO (Axel): SOC: We may want to create a separate context for the authentication, to make the code
// easier to maintain and understand.

const QUERY_ME = `
    query {
        me {
            user_id
            full_name
            given_name
            family_name
            email
            phone
            date_of_birth
            avatar
            username
            organizationsWithPermission(permission_name: "attend_live_class_as_a_student_187") {
                roles {
                    role_id
                    role_name
                }
                organization {
                    organization_id
                    organization_name
                    owner { email }
                }
            }
            schoolsWithPermission(permission_name: "attend_live_class_as_a_student_187") {
                roles {
                    role_id
                    role_name
                }
                school {
                    school_id
                    school_name
                }
            }
            classesStudying {
                class_id
                class_name
                organization {
                    organization_id
                    organization_name
                }
            }
        }
    }
`;

const QUERY_MY_USERS = `
    query {
        my_users {
            user_id
            full_name
            given_name
            family_name
            email
            phone
            date_of_birth
            avatar
            username
            memberships {
                status
            }
        }
    }
`;

type SchoolResponse = {
    school_id: string,
    school_name: string
}

type UserResponse = {
    user_id: string,
    full_name: string | null,
    given_name: string | null,
    family_name: string | null,
    email: string | null,
    phone: string | null,
    date_of_birth: string | null,
    avatar: string | null,
    username: string | null,

    organizationsWithPermission: { organization: OrganizationResponse, roles: RoleResponse[] }[],
    schoolsWithPermission: { school: SchoolResponse, roles: RoleResponse[] }[],
    classesStudying: ClassResponse[],

    memberships: OrganizationResponse[]
}

type UserQueryResponse = {
    data: {
        me: UserResponse
    }
}

type MyUsersQueryResponse = {
    data: {
        my_users: UserResponse[]
    }
}

async function fetchQuery<TResult>(url: string, query: string): Promise<TResult> {
    const headers = new Headers();
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");

    const response = await fetch(url, {
        body: JSON.stringify({ query }),
        credentials: "include",
        headers,
        method: "POST",
    });

    if (!response.ok) throw new Error(response.statusText);

    return await response.json();
}

export class UserInformationService implements IUserInformationService {
    private endpoint: string;
    private auth: IAuthenticationService;

    constructor(endpoint: string, auth: IAuthenticationService) {
        this.endpoint = endpoint;
        this.auth = auth;
    }

    async me(): Promise<UserInformation> {
        let result = await fetchQuery<UserQueryResponse>(this.endpoint, QUERY_ME);
        if (!result.data?.me && this.auth) {
            const isAuthenticated = await this.auth.refresh();
            if (isAuthenticated) {
                result = await fetchQuery(this.endpoint, QUERY_ME);
            } else {
                throw new Error("Account is signed out")
            }
        }

        if (!result.data?.me) {
            throw new Error("Unable to fetch user");
        }

        return this.userInformationFromResponseData(result.data.me);
    }

    private userInformationFromResponseData = (me: UserResponse) => {
        const information: UserInformation = {
            id: me.user_id || "",
            email: me.email || "",
            phone: me.phone || "",
            givenName: me.given_name || "",
            familyName: me.family_name || "",
            fullName: me.full_name || "",
            username: me.username || "",
            dateOfBirth: me.date_of_birth || "",
            avatar: me.avatar || "",
            organizations: me.organizationsWithPermission || [], // TODO (Isu): schoolsWithPermission also needs to be considered in the future.
            classes: me.classesStudying || [],
            memberships: me.memberships || [],
        }

        return information;
    }

    async getMyUsers(): Promise<UserInformation[]> {
        let result = await fetchQuery<MyUsersQueryResponse>(this.endpoint, QUERY_MY_USERS);
        if (!result.data?.my_users && this.auth) {
            const isAuthenticated = await this.auth.refresh();
            if (isAuthenticated) {
                result = await fetchQuery(this.endpoint, QUERY_MY_USERS);
            } else {
                throw new Error("Account is signed out");
            }
        }

        if (!result.data?.my_users) {
            throw new Error("Unable to fetch my users");
        }

        const usersWithOrganizations = 
            result.data!.my_users.filter(v => v.memberships && v.memberships.length > 0);

        return usersWithOrganizations.map(v => this.userInformationFromResponseData(v));
    }
}