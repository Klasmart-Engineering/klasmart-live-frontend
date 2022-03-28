import { useWhiteboardDisplayMutation } from "@/data/live/mutations/useWhiteboardDisplayMutation";
import { useWhiteboardEventMutation } from "@/data/live/mutations/useWhiteboardEventMutation";
import { useWhiteboardPermissionsMutation } from "@/data/live/mutations/useWhiteboardPermissionsMutation";
import { useWhiteboardEventsSubscription } from "@/data/live/subscriptions/useWhiteboardEventsSubscription";
import { useWhiteboardPermissionsSubscription } from "@/data/live/subscriptions/useWhiteboardPermissionsSubscription";
import { useWhiteboardStateSubscription } from "@/data/live/subscriptions/useWhiteboardStateSubscription";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import { hasControlsState } from "@/store/layoutAtoms";
import {
    createEmptyPermissions,
    createPermissions,
    Permissions,
} from "@/whiteboard/types/Permissions";
import { PainterEvent } from "@kl-engineering/kidsloop-canvas/lib/domain/whiteboard/event-serializer/PainterEvent";
import { useSharedEventSerializer } from "@kl-engineering/kidsloop-canvas/lib/domain/whiteboard/SharedEventSerializerProvider";
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
import { useRecoilValue } from "recoil";

export type PainterEventFunction = (payload: PainterEvent) => void

interface ISynchronizedState {
    display: boolean;
    localDisplay: boolean;
    eventsLoading: boolean;
    stateLoading: boolean;
    permissionsLoading: boolean;
    permissions: Permissions;
    userPermissions: Map<string, Permissions>;
}

interface ISynchronizedStateContext {
    state: ISynchronizedState;
    actions: {
        setDisplay: (display: boolean) => void;
        setLocalDisplay: React.Dispatch<React.SetStateAction<boolean>>;
        setPermissions: (userId: string, permissions: Permissions) => void;
        getPermissions: (userId: string) => Permissions;
        refetchEvents: () => void;
    };
}

class WhiteboardNoProviderError extends Error {
    constructor () {
        super(`useSynchronizedState must be used within a WhiteboardStateProvider`);
        this.name = `WHITEBOARD_NO_PROVIDER_ERROR`;
    }
}

const Context = createContext<ISynchronizedStateContext>({
    state: {
        display: true,
        localDisplay: false,
        eventsLoading: false,
        stateLoading: false,
        permissionsLoading: false,
        permissions: createEmptyPermissions(),
        userPermissions: new Map(),
    },
    actions: {
        setDisplay: () => { throw new WhiteboardNoProviderError(); },
        setLocalDisplay: () => { throw new WhiteboardNoProviderError(); },
        setPermissions: () => { throw new WhiteboardNoProviderError(); },
        getPermissions: () => { throw new WhiteboardNoProviderError(); },
        refetchEvents: () => { throw new WhiteboardNoProviderError(); },
    },
});

type Props = {
    children?: ReactChild | ReactChildren | null | any;
};

export const SynchronizedStateProvider: FunctionComponent<Props> = ({ children }: Props): JSX.Element => {
    const {
        sessionId,
        roomId,
        isTeacher,
        classType,
    } = useSessionContext();

    const hasControls = useRecoilValue(hasControlsState);

    const [ events ] = useState<PainterEvent[]>([]);

    const [ localDisplay, setLocalDisplay ] = useState<boolean>(false);

    const { state: { eventSerializer, eventController } } = useSharedEventSerializer();

    const [ sendEventMutation ] = useWhiteboardEventMutation();
    const [ sendDisplayMutation ] = useWhiteboardDisplayMutation();
    const [ sendPermissionsMutation ] = useWhiteboardPermissionsMutation();

    const { loading: eventsLoading } = useWhiteboardEventsSubscription({
        onSubscriptionData: ({ subscriptionData: { data } }) => {
            const whiteboardEvents = data?.whiteboardEvents;
            if (whiteboardEvents && eventController) {
                events.push(...whiteboardEvents);

                eventController.handlePainterEvent(whiteboardEvents);
            }
        },
        variables: {
            roomId,
        },
    });

    const { loading: stateLoading } = useWhiteboardStateSubscription({
        onSubscriptionData: ({ subscriptionData: { data } }) => {
            const whiteboardState = data?.whiteboardState;
            if (whiteboardState) {
                setDisplay(whiteboardState.display);
            }
        },
        variables: {
            roomId,
        },
    });

    const { loading: permissionsLoading } = useWhiteboardPermissionsSubscription({
        onSubscriptionData: ({ subscriptionData: { data } }) => {
            const whiteboardPermissions = data?.whiteboardPermissions;
            if (whiteboardPermissions) {
                const permissions = JSON.parse(whiteboardPermissions);
                userPermissions.set(sessionId, permissions);

                setUserPermissions(userPermissions);
                setSelfPermissions(permissions);
            }
        },
        variables: {
            roomId,
            userId: sessionId,
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
    const [ selfPermissions, setSelfPermissions ] = useState<Permissions>(createEmptyPermissions());
    useEffect(() => {
        setSelfPermissions(createPermissions(hasControls));
    }, [ hasControls ]);
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
        if (!eventSerializer || classType === ClassType.STUDY) return;
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
        const existingPermissions = userPermissions.get(userId);
        if (existingPermissions) {
            return existingPermissions;
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

    const synchronizedStateProviderActions = {
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
                    userPermissions,
                },
                actions: synchronizedStateProviderActions,
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
