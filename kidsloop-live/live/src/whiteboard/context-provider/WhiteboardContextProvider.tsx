import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useState, ReactChild, ReactChildren } from "react";
import { BrushParameters } from "../types/BrushParameters";
import { PointerPainterController } from "../controller/PointerPainterController";
import { PaintEventSerializer } from "../event-serializer/PaintEventSerializer";
import { EventPainterController } from "../controller/EventPainterController";
import { IPainterController } from "../controller/IPainterController";
import { UserContext } from "../../entry";
import { gql } from "apollo-boost";
import { useMutation, useSubscription } from "@apollo/react-hooks";

interface IWhiteboardState {
  loading: boolean;
  display: boolean;
  allowPaint: boolean;
  brushParameters: BrushParameters;
  pointerPainter?: PointerPainterController;
  remotePainter?: EventPainterController;
}

interface IWhiteboardContext {
  state: IWhiteboardState;
  actions: any;
}

const Context = createContext<IWhiteboardContext>({
    state: {loading: true, display: false, allowPaint: false, brushParameters: BrushParameters.default()},
    actions: {},
});

type Props = {
  children?: ReactChild | ReactChildren | null;
  allowPaint: boolean;
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
    controller.on("painterClear", id => {
        serializer.painterClear(id);
    });
    controller.on("painterLine", (id, p1, p2) => {
        serializer.painterLine(id, p1, p2);
    });
}

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
      param
    }
  }
`;

export const WhiteboardContextProvider: FunctionComponent<Props> = ({ children, allowPaint }: Props): JSX.Element => {
    const [brushParameters, setBrushParameters] = useState<BrushParameters>(BrushParameters.default());
    const [pointerPainter, setPointerPainter] = useState<PointerPainterController | undefined>(undefined);
    const [remotePainter, setRemotePainter] = useState<EventPainterController | undefined>(undefined);
    const [display, setDisplay] = useState<boolean>(false);
  
    const [sendEventMutation] = useMutation(WHITEBOARD_SEND_EVENT);

    const { name, roomId } = useContext(UserContext);

    const { loading } = useSubscription(SUBSCRIBE_WHITEBOARD_EVENTS, {
        onSubscriptionData: ({ subscriptionData: { data: { whiteboardEvents } } }) => {
            if (remotePainter) {
                remotePainter.handlePainterEvent(whiteboardEvents);
            }
        }, variables: { roomId } });

    useEffect(() => {
        const remotePainter = new EventPainterController(NormalizeCoordinates);

        setRemotePainter(remotePainter);
    }, []);

    useEffect(() => {
        if (!name || !roomId)
            return;

        const localEventSerializer = new PaintEventSerializer(NormalizeCoordinates);
        const pointerPainter = new PointerPainterController(name, true);
        attachEventSerializer(pointerPainter, localEventSerializer);

        localEventSerializer.on("event", payload => {
            sendEventMutation({ variables: { roomId, event: JSON.stringify(payload) } } );
        });

        setPointerPainter(pointerPainter);
    }, [roomId, name]);

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

    const setDisplayAction = useCallback(
        (display: boolean) => {
            setDisplay(display);
        },
        [setDisplay]
    );

    const WhiteboardProviderActions = {
        clear: clearAction,
        setBrush: setBrushAction,
        display: setDisplayAction,
    };

    return (
        <Context.Provider value={{
            state: {
                loading,
                display,
                allowPaint,
                pointerPainter,
                remotePainter,
                brushParameters
            }, actions: WhiteboardProviderActions }}>
            {children}
        </Context.Provider>
    );
};

export function useWhiteboard(): IWhiteboardContext {
    return useContext(Context);
}

export default WhiteboardContextProvider;
