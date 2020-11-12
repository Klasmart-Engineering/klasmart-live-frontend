import React, { createContext, ReactChild, ReactChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setErrCode } from "../store/reducers/communication";

// TODO (Axel): All of this context can be combined with the user-context from 
// the combined master branch. This would be preferred since they share
// the same responsibilities. Not using the same name at this point to
// prevent conflicts later when integrating.

const QUERY_ME = `
    query { 
        me {
            user_id
            email
            user_name
            my_organization {
                organization_id
                organization_name
            }
            memberships {
                roles {
                    role_id
                    role_name
                    organization {
                        organization_id
                        organization_name
                    }
                }
            }
        }
    }
`;

type Props = {
    children?: ReactChild | ReactChildren | null
}

type Role = {
    id: string,
    name: string,
}

type Organization = {
    id: string,
    name: string,
    roles: Role[],
}

type UserInformation = {
    id: string
    email: string
    fullName: string
    organizations: Organization[]
}

type UserInformationActions = {
    refresh: () => void
}

type UserInformationContext = {
    loading: boolean,
    error: boolean,
    information?: UserInformation
    actions?: UserInformationActions
}

const UserInformationEndpoint = "https://api.kidsloop.net/user/";
const UserInformationContext = createContext<UserInformationContext>({ loading: true, error: false, information: undefined, actions: undefined });

export function isRoleTeacher(role: string) {
    const teacherRoleNames = [
        "Organization Admin",
        "School Admin",
        "Teacher",
    ].map(v => v.toLowerCase());

    return teacherRoleNames.includes(role.toLowerCase());
}

export function UserInformationContextProvider({ children }: Props) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [information, setInformation] = useState<UserInformation | undefined>(undefined);

    const userInformationFromResponseData = (me: any) => {
        const information: UserInformation = {
            id: me.user_id,
            email: me.email,
            fullName: me.user_name,
            organizations: [],
        }

        let organizations = new Map<string, Organization>();

        const my_org = me.my_organization;
        if (my_org) {
            organizations.set(my_org.id, {
                id: my_org.organization_id,
                name: my_org.organization_name,
                roles: [{
                    id: "",
                    name: "Organization Admin"
                }]
            });
        }

        const memberships = me.memberships;

        if (memberships) {
            memberships.forEach((membership: any) => {
                if (!membership.roles) return;

                membership.roles.forEach((membership_role: any) => {
                    const { organization_id, organization_name } = membership_role.organization;
                    let org = organizations.get(membership_role.organization.organization_id);
                    if (!org) {
                        org = {
                            id: organization_id,
                            name: organization_name,
                            roles: [],
                        };

                        organizations.set(organization_id, org);
                    }

                    org.roles.push({
                        id: membership_role.role_id,
                        name: membership_role.role_name,
                    });
                });
            });
        }

        information.organizations = Array.from(organizations.values());

        return information;
    }

    const fetchInformation = useCallback(() => {
        if (loading) return;
        setLoading(true);

        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");

        fetch(UserInformationEndpoint, {
            body: JSON.stringify({ query: QUERY_ME }),
            credentials: "include",
            headers,
            method: "POST",
        }).then(async (response) => {
            const { data } = await response.json();
            if (!data || data.me === null) {
                setInformation(undefined);
                setError(true);
                dispatch(setErrCode(401));
            } else {
                setInformation(userInformationFromResponseData(data.me));
            }

            setLoading(false);
        }).catch(err => {
            console.error(err);
            setError(true);
            dispatch(setErrCode(500));
            setLoading(false);
        });
    }, []);

    const context = useMemo<UserInformationContext>(() => {
        return { loading, error, information, actions: { refresh: fetchInformation } }
    }, [information, loading, error, fetchInformation])

    useEffect(() => {
        fetchInformation();
    }, []);

    return (
        <UserInformationContext.Provider value={context}>
            { children}
        </UserInformationContext.Provider >
    )
}

export function useUserInformation() {
    return useContext(UserInformationContext);
}