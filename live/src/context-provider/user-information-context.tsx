import { useQuery } from "@apollo/react-hooks/lib/useQuery";
import { gql } from "apollo-boost";
import React, { createContext, ReactChild, ReactChildren, useCallback, useContext, useMemo } from "react";

// TODO (Axel): All of this context can be combined with the user-context from 
// the combined master branch. This would be preferred since they share
// the same responsibilities. Not using the same name at this point to
// prevent conflicts later when integrating.

const QUERY_ME = gql`
    query me {
        user_id
        email
        user_name
        my_organization {
            organization_id
            organization_name
        }
        memberships {
            organization {
                organization_id
                organization_name
            }
        }
    }
`;

type Props = {
    children?: ReactChild | ReactChildren | null
}

type Organization = {
    id: string,
    name: string
}

type UserInformation = {
    id: string
    email: string,
    fullName: string
    myOrganization?: Organization
    memberships: Organization[]
}

type UserOrganization = {
    id: string
    name: string
    role: {
        id: string
        name: string
    }
}

type UserInformationActions = {
    refresh: () => void
}

type UserInformationContext = {
    loading: boolean,
    error: boolean,
    information?: UserInformation
    organization?: UserOrganization
    actions?: UserInformationActions
}

const UserInformationContext = createContext<UserInformationContext>({ loading: true, error: false, information: undefined, organization: undefined, actions: undefined });

export function UserInformationContextProvider({ children }: Props) {
    const { loading, error, data, refetch } = useQuery(QUERY_ME);
    const refresh = useCallback(() => refetch(), [refetch]);

    const information = useMemo<UserInformation | undefined>(() => {
        if (error) return undefined;

        return undefined;
    }, [error, data]);

    const context = useMemo<UserInformationContext>(() => {
        let isError = false;

        if (error) {
            console.error(error.message);
            isError = true;
        }

        return { loading, error: isError, information, actions: { refresh } }
    }, [information, loading, error, refresh, data])

    return (
        <UserInformationContext.Provider value={context}>
            { children}
        </UserInformationContext.Provider >
    )
}

export function useUserInformation() {
    return useContext(UserInformationContext);
}