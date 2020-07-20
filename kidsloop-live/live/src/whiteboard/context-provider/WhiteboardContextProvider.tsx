import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useState, ReactChild, ReactChildren } from "react";
import { BrushParameters } from "../types/BrushParameters";
import { PointerPainterController } from "../controller/PointerPainterController";
import { PaintEventSerializer } from "../event-serializer/PaintEventSerializer";
import { EventPainterController } from "../controller/EventPainterController";
import { IPainterController } from "../controller/IPainterController";
import { UserContext } from "../../entry";
import { gql } from "apollo-boost";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import { Permissions, createPermissions, createEmptyPermissions } from "../types/Permissions";
import { ShapesRepository } from "../composition/ShapesRepository";
import { Point2D } from "../types/Point2D";

interface IWhiteboardState {
    display: boolean;
    permissions: Permissions;
    brushParameters: BrushParameters;
    pointerPainter?: PointerPainterController;
    remotePainter?: EventPainterController;
    shapesRepository?: ShapesRepository;
}

interface IWhiteboardContext {
    state: IWhiteboardState;
    actions: any;
}

const Context = createContext<IWhiteboardContext>({
    state: { display: false, permissions: createEmptyPermissions(), brushParameters: BrushParameters.default() },
    actions: {},
});

type Props = {
    children?: ReactChild | ReactChildren | null;
}

// NOTE: This is used to scale up the coordinates sent in events
// to save bytes in the text representation of numbers. E.g. 33
// instead of 0.0333333333. Sacrificing some sub-pixel accuracy.
const NormalizeCoordinates = 1000;

function attachEventSerializer(controller: IPainterController, serializer: PaintEventSerializer) {
    controller.on("operationBegin", (id, params) => {
        serializer.operationBegin(id, params);
    });
    controller.on("operationEnd", id => {
        serializer.operationEnd(id);
    });
    controller.on("painterLine", (id, p1, p2) => {
        serializer.painterLine(id, p1, p2);
    });
    controller.on("painterClear", id => {
        serializer.painterClear(id);
    })
}

const WHITEBOARD_SEND_EVENT = gql`
  mutation whiteboardSendEvent($roomId: ID!, $event: String) {
    whiteboardSendEvent(roomId: $roomId, event: $event)
  }
`;

const WHITEBOARD_SEND_DISPLAY = gql`
  mutation whiteboardSendDisplay($roomId: ID!, $display: Boolean) {
      whiteboardSendDisplay(roomId: $roomId, display: $display)
  }
`;

const SUBSCRIBE_WHITEBOARD_EVENTS = gql`
  subscription whiteboardEvents($roomId: ID!) {
    whiteboardEvents(roomId: $roomId) {
      type
      id
      param
    }
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

export const WhiteboardContextProvider: FunctionComponent<Props> = ({ children }: Props): JSX.Element => {
    const [brushParameters, setBrushParameters] = useState<BrushParameters>(BrushParameters.default());
    const [pointerPainter, setPointerPainter] = useState<PointerPainterController | undefined>(undefined);
    const [remotePainter, setRemotePainter] = useState<EventPainterController | undefined>(undefined);
    const [display, setDisplay] = useState<boolean>(false);
    const [eventSerializer, setEventSerializer] = useState<PaintEventSerializer | undefined>(undefined);
    const [shapesRepository] = useState<ShapesRepository>(new ShapesRepository());

    const [sendEventMutation] = useMutation(WHITEBOARD_SEND_EVENT);
    const [sendDisplayMutation] = useMutation(WHITEBOARD_SEND_DISPLAY);

    const { sessionId, roomId, teacher } = useContext(UserContext);

    const [permissions, setPermissions] = useState<Permissions>(createPermissions(teacher));

    useSubscription(SUBSCRIBE_WHITEBOARD_EVENTS, {
        onSubscriptionData: ({ subscriptionData: { data: { whiteboardEvents } } }) => {
            if (remotePainter) {
                remotePainter.handlePainterEvent(whiteboardEvents);
            }
        }, variables: { roomId }
    });

    useSubscription(SUBSCRIBE_WHITEBOARD_STATE, {
        onSubscriptionData: ({ subscriptionData: { data: { whiteboardState } } }) => {
            if (whiteboardState) {
                setDisplay(whiteboardState.display);
            }
        }, variables: { roomId }
    });

    useSubscription(SUBSCRIBE_WHITEBOARD_PERMISSIONS, {
        onSubscriptionData: ({ subscriptionData: { data: { whiteboardPermissions } } }) => {
            if (whiteboardPermissions) {
                setPermissions(JSON.parse(whiteboardPermissions as string));
            }
        }, variables: { roomId, userId: sessionId }
    });

    useEffect(() => {
        if (!sessionId) return;

        const remotePainter = new EventPainterController(sessionId, NormalizeCoordinates);

        setRemotePainter(remotePainter);
    }, [sessionId]);

    useEffect(() => {
        if (remotePainter === undefined || eventSerializer === undefined) {
            return;
        }

        // TODO: Any way this filtering can be improved. I dislike running it
        // for each event coming through. It would be better if it can be dealt
        // with somewhere else.
        const handleOperationBegin = (id: string, params: BrushParameters) => {
            if (!eventSerializer.didSerializeEvent(id)) {
                shapesRepository.createShape(id, params);
            }
        };

        const handlePainterClear = (id: string) => {
            if (!eventSerializer.didSerializeEvent(id)) {
                shapesRepository.clear(id);
            }
        };

        const handlePainterLine = (id: string, p1: Point2D, p2: Point2D) => {
            if (!eventSerializer.didSerializeEvent(id)) {
                shapesRepository.appendLine(id, [p1, p2]);
            }
        };

        remotePainter.on("operationBegin", handleOperationBegin);
        remotePainter.on("painterClear", handlePainterClear);
        remotePainter.on("painterLine", handlePainterLine);

        shapesRepository.clearAll();
        remotePainter.replayEvents();

        return () => {
            remotePainter.removeListener("operationBegin", handleOperationBegin);
            remotePainter.removeListener("painterClear", handlePainterClear);
            remotePainter.removeListener("painterLine", handlePainterLine);
        };

    }, [remotePainter, shapesRepository, eventSerializer]);

    useEffect(() => {
        if (!sessionId || !roomId)
            return;

        const pointerPainter = new PointerPainterController(sessionId, true);
        pointerPainter.on("operationBegin", (id: string, params: BrushParameters) => shapesRepository.createShape(id, params));
        pointerPainter.on("painterClear", id => shapesRepository.clear(id));
        pointerPainter.on("painterLine", (id, p1, p2) => shapesRepository.appendLine(id, [p1, p2]));

        const localEventSerializer = new PaintEventSerializer(NormalizeCoordinates);
        attachEventSerializer(pointerPainter, localEventSerializer);

        localEventSerializer.on("event", payload => {
            sendEventMutation({ variables: { roomId, event: JSON.stringify(payload) } });
        });

        setEventSerializer(localEventSerializer);
        setPointerPainter(pointerPainter);
    }, [roomId, sessionId]);

    useEffect(() => {
        if (pointerPainter) {
            pointerPainter.setBrush(brushParameters);
        }
    }, [pointerPainter, brushParameters]);

    const setBrushAction = useCallback(
        (brush: BrushParameters) => {
            setBrushParameters(brush);
        },
        [setBrushParameters]
    );

    const clearAction = useCallback(() => {
        if (pointerPainter) {
            pointerPainter.clear();
        }
    }, [pointerPainter]);

    const clearOtherAction = useCallback((otherId: string) => {
        if (!shapesRepository || !eventSerializer) {
            return;
        }

        // NOTE: Clear the local repository (optimistically).
        shapesRepository.clear(otherId);

        // NOTE: Serialize clear event to send to others.
        eventSerializer.painterClear(otherId);

    }, [shapesRepository, eventSerializer]);

    const setDisplayAction = useCallback(
        (display: boolean) => {
            sendDisplayMutation({ variables: { roomId: roomId, display: display } });
            setDisplay(display);
        },
        [setDisplay]
    );

    const WhiteboardProviderActions = {
        clear: clearAction,
        clearOther: clearOtherAction,
        setBrush: setBrushAction,
        display: setDisplayAction,
    };

    return (
        <Context.Provider value={{
            state: {
                display,
                permissions,
                pointerPainter,
                remotePainter,
                brushParameters,
                shapesRepository
            }, actions: WhiteboardProviderActions
        }}>
            {children}
        </Context.Provider>
    );
};

export function useWhiteboard(): IWhiteboardContext {
    return useContext(Context);
}

export default WhiteboardContextProvider;
