import { gql, useQuery } from "@apollo/client";
import React, { createContext, FunctionComponent, ReactChild, ReactChildren, useContext } from "react";


const QUERY_VERIFY_TOKEN = gql`
    query token {
        token {
            userName
            isTeacher
            roomId
            materials {
                name
                url
            }
        }
    }
`;

export interface IToken {
    userName: string,
    roomId: string,
    isTeacher: boolean,
    materials: { name: string, url: string}[],
}

interface IAuthTokenState {
    isLoading: boolean,
    token: IToken | undefined,
}

interface IAuthTokenContext {
    state: IAuthTokenState;
    actions: any;
}

const Context = createContext<IAuthTokenContext>({
    state: {isLoading: true, token: undefined}, 
    actions: {}
});

type Props = {
    children?: ReactChild | ReactChildren | null;
}

export const AuthTokenContextProvider: FunctionComponent<Props> = ({ children }: Props): JSX.Element => {
    const { loading, data } = useQuery(QUERY_VERIFY_TOKEN);

    const AuthTokenProviderActions = {};

    return (
        <Context.Provider value={{
            state: {
                isLoading: loading,
                token: data.token as IToken,
            },
            actions: AuthTokenProviderActions,
        }}>
            {children}
        </Context.Provider>
    );
};

export function useAuthToken(): IAuthTokenContext {
    return useContext(Context);
}

export default AuthTokenContextProvider;