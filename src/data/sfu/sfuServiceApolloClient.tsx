import {
    ApolloClient,
    NormalizedCacheObject,
} from "@apollo/client";
import React,
{
    createContext,
    useContext,
} from "react";


interface SfuServiceApolloClientState {
    client?: ApolloClient<NormalizedCacheObject>;
    isLoading: boolean;
    isError: boolean;
}

const SfuServiceApolloClientContext = createContext<SfuServiceApolloClientState>({
    isLoading: true,
    isError: false,
});

export const useSfuServiceApolloClient = () => useContext(SfuServiceApolloClientContext);
