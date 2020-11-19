import React, { createContext, ReactChild, ReactChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { setErrCode } from "../store/reducers/communication";

// TODO (Axel): All of this context can be combined with the user-context from 
// the combined master branch. This would be preferred since they share
// the same responsibilities. Not using the same name at this point to
// prevent conflicts later when integrating.

type OrganizationPayload = {
    organization_id: string,
    organization_name: string,
    owner: { email: string }
}

type SchoolPayload = {
    school_id: string,
    school_name: string
}

type RolePayload = {
    role_id: string,
    role_name: string
}

type ClassPayload = {
    class_id: string,
    class_name: string
}

type MePayload = {
    user_id: string,
    email: string,
    user_name: string | null,
    given_name: string | null,
    family_name: string | null,
    avatar: string | null,
    organizationsWithPermission: { organization: OrganizationPayload, roles: RolePayload[] }[],
    schoolsWithPermission: { school: SchoolPayload, roles: RolePayload[] }[],
    classesStudying: ClassPayload[]
}

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
            }
        }
    }
`
type Props = {
    children?: ReactChild | ReactChildren | null
}

type Role = {
    id: string,
    name: string,
}

type Organization = {
    organization: OrganizationPayload,
    roles: RolePayload[]
}

type UserInformation = {
    id: string
    email: string
    name: string,
    firstName: string
    lastName: string
    avatar: string
    organizations: Organization[],
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
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<boolean>(false);
    const [information, setInformation] = useState<UserInformation | undefined>(undefined);

    const userInformationFromResponseData = (me: MePayload) => {
        const information: UserInformation = {
            id: me.user_id,
            email: me.email,
            name: me.user_name ? me.user_name : "",
            firstName: me.given_name ? me.given_name : "",
            lastName: me.family_name ? me.family_name : "",
            avatar: me.avatar ? me.avatar : "",
            organizations: me.organizationsWithPermission,
            // TODO (Isu): schoolsWithPermission also needs to be considered in the future.
        }

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
            const { data }: { data: { me: MePayload } } = await response.json();
            if (!data || data.me === null) {
                setInformation(undefined);
                setError(true);
            } else {
                setInformation(userInformationFromResponseData(data.me));
            }

            setLoading(false);
        }).catch(err => {
            console.error(err);
            setError(true);
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