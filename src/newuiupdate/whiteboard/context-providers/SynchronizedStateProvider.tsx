import { LIVE_LINK, LocalSessionContext } from "../../providers/providers";
import {
    createEmptyPermissions, createPermissions, Permissions,
} from "../types/Permissions";
import {
    gql, useMutation, useSubscription,
} from "@apollo/client";
import { PainterEvent } from "kidsloop-canvas/lib/domain/whiteboard/event-serializer/PainterEvent";
import { useSharedEventSerializer } from "kidsloop-canvas/lib/domain/whiteboard/SharedEventSerializerProvider";
import React, {
    createContext,
    FunctionComponent,
    ReactChild,
    ReactChildren,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

export type PainterEventFunction = (payload: PainterEvent) => void

const WHITEBOARD_SEND_EVENT = gql`
  mutation whiteboardSendEvent($roomId: ID!, $event: String) {
    whiteboardSendEvent(roomId: $roomId, event: $event)
  }
`;

const SUBSCRIBE_WHITEBOARD_EVENTS = gql`
  subscription whiteboardEvents($roomId: ID!) {
    whiteboardEvents(roomId: $roomId) {
      type
      id
      generatedBy
      objectType
      param
    }
  }
`;

const WHITEBOARD_SEND_DISPLAY = gql`
  mutation whiteboardSendDisplay($roomId: ID!, $display: Boolean) {
      whiteboardSendDisplay(roomId: $roomId, display: $display)
  }
`;

const WHITEBOARD_SEND_PERMISSIONS = gql`
  mutation whiteboardSendPermissions($roomId: ID!, $userId: ID!, $permissions: String) {
      whiteboardSendPermissions(roomId: $roomId, userId: $userId, permissions: $permissions)
  }
`;

const SUBSCRIBE_WHITEBOARD_STATE = gql`
  subscription whiteboardState($roomId: ID!) {
      whiteboardState(roomId: $roomId) {
          display
      }
  }`;

const SUBSCRIBE_WHITEBOARD_PERMISSIONS = gql`
  subscription whiteboardPermissions($roomId: ID! $userId: ID!) {
      whiteboardPermissions(roomId: $roomId, userId: $userId)
  }`;

interface ISynchronizedState {
    display: boolean;
    localDisplay: boolean,
    eventsLoading: boolean;
    stateLoading: boolean;
    permissionsLoading: boolean;
    permissions: Permissions;
}

interface ISynchronizedStateContext {
    state: ISynchronizedState;
    actions: any;
}

const Context = createContext<ISynchronizedStateContext>({
    state: {
        display: true,
        localDisplay: false,
        eventsLoading: false,
        stateLoading: false,
        permissionsLoading: false,
        permissions: createEmptyPermissions(),
    },
    actions: {},
});

type Props = {
    children?: ReactChild | ReactChildren | null | any;
};

export const SynchronizedStateProvider: FunctionComponent<Props> = ({ children }: Props): JSX.Element => {
    const {
        sessionId, roomId, isTeacher,
    } = useContext(LocalSessionContext);

    const [ events ] = useState<PainterEvent[]>([]);

    const [localDisplay, setLocalDisplay] = useState<boolean>(false);

    const { state: { eventSerializer, eventController } } = useSharedEventSerializer();

    const [ sendEventMutation ] = useMutation(WHITEBOARD_SEND_EVENT, {
        context: {
            target: LIVE_LINK,
        },
    });
    const [ sendDisplayMutation ] = useMutation(WHITEBOARD_SEND_DISPLAY, {
        context: {
            target: LIVE_LINK,
        },
    });
    const [ sendPermissionsMutation ] = useMutation(WHITEBOARD_SEND_PERMISSIONS, {
        context: {
            target: LIVE_LINK,
        },
    });

    const { loading: eventsLoading } = useSubscription(SUBSCRIBE_WHITEBOARD_EVENTS, {
        onSubscriptionData: ({ subscriptionData: { data: { whiteboardEvents } } }) => {
            if (whiteboardEvents && eventController) {
                events.push(...whiteboardEvents);

                eventController.handlePainterEvent(whiteboardEvents);
            }
        },
        variables: {
            roomId,
        },
        context: {
            target: LIVE_LINK,
        },
    });

    const { loading: stateLoading } = useSubscription(SUBSCRIBE_WHITEBOARD_STATE, {
        onSubscriptionData: ({ subscriptionData: { data: { whiteboardState } } }) => {
            if (whiteboardState) {
                setDisplay(whiteboardState.display);
            }
        },
        variables: {
            roomId,
        },
        context: {
            target: LIVE_LINK,
        },
    });

    const { loading: permissionsLoading } = useSubscription(SUBSCRIBE_WHITEBOARD_PERMISSIONS, {
        onSubscriptionData: ({ subscriptionData: { data: { whiteboardPermissions } } }) => {
            if (whiteboardPermissions) {
                const permissions = JSON.parse(whiteboardPermissions as string);
                userPermissions.set(sessionId, permissions);

                setUserPermissions(userPermissions);
                setSelfPermissions(permissions);
            }
        },
        variables: {
            roomId,
            userId: sessionId,
        },
        context: {
            target: LIVE_LINK,
        },
    });

    const refetchEvents = useCallback(() => {
        if (!eventController) return;
        eventController.handlePainterEvent(events, true);
    }, [ eventController ]);

    useEffect(() => {
        if (!eventController) return;

        const refetchRequestHandler = () => {
            refetchEvents();
        };

        eventController.on(`refetch`, refetchRequestHandler);

        return () => {
            eventController.removeListener(`refetch`, refetchRequestHandler);
        };
    }, [ eventController, refetchEvents ]);

    const [ display, setDisplay ] = useState<boolean>(false);
    const [ selfPermissions, setSelfPermissions ] = useState<Permissions>(createPermissions(isTeacher));
    const [ userPermissions, setUserPermissions ] = useState<Map<string, Permissions>>(new Map());

    const sendEventAction = useCallback((payload: PainterEvent) => {
        sendEventMutation({
            variables: {
                roomId,
                event: JSON.stringify(payload),
            },
        });
    }, [ sendEventMutation, roomId ]);

    const setDisplayAction = useCallback((display: boolean) => {
        sendDisplayMutation({
            variables: {
                roomId: roomId,
                display: display,
            },
        });
        setDisplay(display);
    }, [ setDisplay, roomId ]);

    const setPermissionsAction = useCallback((userId: string, permissions: Permissions) => {
        const permJson = JSON.stringify(permissions);
        sendPermissionsMutation({
            variables: {
                roomId,
                userId,
                permissions: permJson,
            },
        });

        userPermissions.set(userId, permissions);
        setUserPermissions(userPermissions);
    }, [ setUserPermissions, roomId ]);

    const refetchEventsAction = useCallback(() => {
        refetchEvents();
    }, [ refetchEvents ]);

    useEffect(() => {
        if (!eventSerializer) return;
        const serializer = eventSerializer;

        const sendEventHandler = (payload: PainterEvent) => {
            sendEventAction(payload);
        };

        serializer.on(`event`, sendEventHandler);

        return () => {
            serializer.removeListener(`event`, sendEventHandler);
        };
    }, [ eventSerializer ]);

    const getPermissionsAction = useCallback((userId: string): Permissions => {
        if (userPermissions.has(userId)) {
            return userPermissions.get(userId)!;
        }

        const permissions = createPermissions(userId === sessionId && isTeacher);
        userPermissions.set(userId, permissions);
        setUserPermissions(userPermissions);

        return permissions;
    }, [
        userPermissions,
        setUserPermissions,
        isTeacher,
        sessionId,
    ]);

    const SynchronizedStateProviderActions = {
        setDisplay: setDisplayAction,
        setLocalDisplay: setLocalDisplay,
        setPermissions: setPermissionsAction,
        getPermissions: getPermissionsAction,
        refetchEvents: refetchEventsAction,
    };

    return (
        <Context.Provider
            value={{
                state: {
                    display,
                    localDisplay,
                    eventsLoading,
                    stateLoading,
                    permissionsLoading,
                    permissions: selfPermissions,
                },
                actions: SynchronizedStateProviderActions,
            }}
        >
            {children}
        </Context.Provider>
    );
};

export function useSynchronizedState (): ISynchronizedStateContext {
    return useContext(Context);
}

export default SynchronizedStateProvider;
