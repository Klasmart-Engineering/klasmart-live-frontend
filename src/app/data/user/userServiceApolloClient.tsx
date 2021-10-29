import { useAuthenticationContext } from "@/app/context-provider/authentication-context";
import { useHttpEndpoint } from "@/providers/region-select-context";
import {
    ApolloClient,
    ApolloProvider,
    HttpLink,
    InMemoryCache,
    NormalizedCacheObject,
} from "@apollo/client";
import React,
{
    createContext,
    useContext,
    useMemo,
} from "react";

interface UserServiceApolloClientState {
    client?: ApolloClient<NormalizedCacheObject>;
}

const UserServiceApolloClientContext = createContext<UserServiceApolloClientState>({});

export const UserServiceApolloClient: React.FC = ({ children }) => {
    const { authenticated } = useAuthenticationContext();
    const endpointUser = useHttpEndpoint(`user`);

    const client = useMemo(() => {
        const link = new HttpLink({
            uri: `${endpointUser}`,
            credentials: `include`,
        });

        const client = new ApolloClient({
            cache: new InMemoryCache(),
            link,
        });

        return client;
    }, [ endpointUser, authenticated ]);

    return (
        <UserServiceApolloClientContext.Provider value={{
            client,
        }}>
            <ApolloProvider client={client}>
                {children}
            </ApolloProvider>
        </UserServiceApolloClientContext.Provider>
    );
};

export const useUserServiceApolloClient = () => useContext(UserServiceApolloClientContext);
