import { ReadEventDto } from "../dto/readEventDto";
import { useLiveServiceApolloClient } from "../liveServiceApolloClient";
import {
    ApolloClient,
    gql,
    NormalizedCacheObject,
    OperationVariables,
    SubscriptionHookOptions,
    useSubscription,
} from "@apollo/client";
import {
    useEffect,
    useState,
} from "react";

const SUB_EVENTS = gql`
  subscription stream($streamId: ID!) {
    stream(streamId: $streamId) {
      id,
      event
    }
  }
`;

export interface ViewportOption {
    onlyObserveInViewport: boolean;
    inViewport: boolean;
}
export const useEventsSubscription = (options?: SubscriptionHookOptions<ReadEventDto, OperationVariables>, viewportOption?: ViewportOption) => {
    const { client } = useLiveServiceApolloClient();
    if( viewportOption?.onlyObserveInViewport ) {
        return useEventsObserve(options, viewportOption.inViewport);
    }
    return useSubscription<ReadEventDto>(SUB_EVENTS, {
        ...options,
        client,
    });
};

export const useEventsObserve = (options?: SubscriptionHookOptions<ReadEventDto, OperationVariables>, inViewPort?: boolean) => {
    const { client } = useLiveServiceApolloClient();
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState<string>();
    const [ data, setData ] = useState<ReadEventDto>();

    const startSubscribing = (client: ApolloClient<NormalizedCacheObject>) => {
        const observe = client?.subscribe<ReadEventDto>({
            query: SUB_EVENTS,
            variables: options?.variables,
        });

        return observe?.subscribe(({ data }) => {
            if (data) {
                setData(data);
            }
        }, (err) => {
            console.log(err);
            setError(err);
        });
    };

    useEffect(() => {
        if (!client || !inViewPort) return;

        const subscription = startSubscribing(client);

        setLoading(false);

        return () => {
            setLoading(true);
            subscription?.unsubscribe();
        };
    }, [ inViewPort, client ]);

    return {
        data,
        loading,
        error,
    };
};
