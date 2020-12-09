import { IAuthenticationService } from "../auth/IAuthenticationService";
import { ClassResponse, IUserInformationService, OrganizationResponse, RoleResponse, UserInformation } from "./IUserInformationService";

const QUERY_ME = `
    query {
        me {
            user_id
            email
            user_name
            given_name
            family_name
            avatar
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
`

type SchoolResponse = {
    school_id: string,
    school_name: string
}

type UserResponse = {
    user_id: string,
    email: string,
    user_name: string | null,
    given_name: string | null,
    family_name: string | null,
    avatar: string | null,
    organizationsWithPermission: { organization: OrganizationResponse, roles: RoleResponse[] }[],
    schoolsWithPermission: { school: SchoolResponse, roles: RoleResponse[] }[],
    classesStudying: ClassResponse[]
}

type UserQueryResponse = {
    data: {
        me: UserResponse
    }
}

async function fetchQuery(url: string, query: string): Promise<UserQueryResponse> {
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
        let result = await fetchQuery(this.endpoint, QUERY_ME);
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
            name: me.user_name || "",
            givenName: me.given_name || "",
            familyName: me.family_name || "",
            avatar: me.avatar || "",
            organizations: me.organizationsWithPermission || [], // TODO (Isu): schoolsWithPermission also needs to be considered in the future.
            classes: me.classesStudying || [],
        }

        return information;
    }
}