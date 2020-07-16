import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useState, ReactChild, ReactChildren } from "react";
import { BrushParameters } from "../types/BrushParameters";
import { PointerPainterController } from "../controller/PointerPainterController";
import { PaintEventSerializer } from "../event-serializer/PaintEventSerializer";
import { useWhiteboardGraphQL } from "../hooks/WhiteboardGraphQL";
import { EventPainterController } from "../controller/EventPainterController";
import { PainterEvent } from "../types/PainterEvent";
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
  defaultAllowPaint: boolean;
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
  
    // NOTE: The clear event is omitted because it shouldn't be sent recursively. 
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
          onlyTeacherDraw
      }
  }`;

export const WhiteboardContextProvider: FunctionComponent<Props> = ({ children, defaultAllowPaint }: Props): JSX.Element => {
    const [brushParameters, setBrushParameters] = useState<BrushParameters>(BrushParameters.default());
    const [pointerPainter, setPointerPainter] = useState<PointerPainterController | undefined>(undefined);
    const [remotePainter, setRemotePainter] = useState<EventPainterController | undefined>(undefined);
    const [display, setDisplay] = useState<boolean>(false);
    const [allowPaint, setAllowPaint] = useState<boolean>(defaultAllowPaint);
    const [eventSerializer, setEventSerializer] = useState<PaintEventSerializer | undefined>(undefined);
  
    const [sendEventMutation] = useMutation(WHITEBOARD_SEND_EVENT);
    const [sendDisplayMutation] = useMutation(WHITEBOARD_SEND_DISPLAY);

    const { name, roomId } = useContext(UserContext);

    const { loading } = useSubscription(SUBSCRIBE_WHITEBOARD_EVENTS, {
        onSubscriptionData: ({ subscriptionData: { data: { whiteboardEvents } } }) => {
            if (remotePainter) {
                remotePainter.handlePainterEvent(whiteboardEvents);
            }
        }, variables: { roomId } });

    useSubscription(SUBSCRIBE_WHITEBOARD_STATE, {
        onSubscriptionData: ({ subscriptionData: { data: { whiteboardState }}}) => {
            if (whiteboardState) {
                setDisplay(whiteboardState.display);
                setAllowPaint(defaultAllowPaint || !whiteboardState.onlyTeacherDraw);
            }
        }, variables: {roomId}});

    useEffect(() => {
        const remotePainter = new EventPainterController(NormalizeCoordinates);

        remotePainter.on("painterClear", (_id) => {
            if (pointerPainter) {
                pointerPainter.clear();
            }
        });

        setRemotePainter(remotePainter);
    }, [pointerPainter]);

    useEffect(() => {
        if (!name || !roomId)
            return;

        const localEventSerializer = new PaintEventSerializer(NormalizeCoordinates);
        const pointerPainter = new PointerPainterController(name, true);
        attachEventSerializer(pointerPainter, localEventSerializer);
        localEventSerializer.on("event", payload => {
            sendEventMutation({ variables: { roomId, event: JSON.stringify(payload) } } );
        });

        setEventSerializer(localEventSerializer);
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
        if (eventSerializer) {
            eventSerializer.painterClear(roomId);
        }
    }, [roomId, pointerPainter, eventSerializer]);

    const setDisplayAction = useCallback(
        (display: boolean) => {
            sendDisplayMutation({ variables: { roomId: roomId, display: display }});
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
