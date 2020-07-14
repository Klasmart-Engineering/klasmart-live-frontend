import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useState, ReactChild, ReactChildren } from "react";
import { BrushParameters } from "../types/BrushParameters";
import { PointerPainterController } from "../controller/PointerPainterController";
import { PaintEventSerializer } from "../event-serializer/PaintEventSerializer";
import { useWhiteboardGraphQL } from "../hooks/WhiteboardGraphQL";
import { EventPainterController } from "../controller/EventPainterController";
import { PainterEvent } from "../types/PainterEvent";
import { IPainterController } from "../controller/IPainterController";
import { UserContext } from "../../entry";

interface IWhiteboardState {
  loading: boolean,
  brushParameters: BrushParameters;
  pointerPainter?: PointerPainterController;
  remotePainter?: EventPainterController;
}

interface IWhiteboardContext {
  state: IWhiteboardState;
  actions: any;
}

const Context = createContext<IWhiteboardContext>({
    state: {loading: true, brushParameters: BrushParameters.default()},
    actions: {},
});

type Props = {
  children?: ReactChild | ReactChildren | null
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

export const WhiteboardContextProvider: FunctionComponent<Props> = ({ children }: Props): JSX.Element => {
    const [brushParameters, setBrushParameters] = useState<BrushParameters>(BrushParameters.default());
    const [pointerPainter, setPointerPainter] = useState<PointerPainterController | undefined>(undefined);
    const [remotePainter, setRemotePainter] = useState<EventPainterController|undefined>(undefined);
  
  const { name, roomId } = useContext(UserContext)

  const handleIncomingEvent = useCallback((roomId: string, event: PainterEvent) => {
    if (remotePainter) {
      remotePainter.handlePainterEvent(event)
    }
  }, [remotePainter, roomId])

  const [sendPointerEvent, loading] = useWhiteboardGraphQL(roomId, (roomId, event) => {
    handleIncomingEvent(roomId, event)
  })

  useEffect(() => {
    const remotePainter = new EventPainterController(NormalizeCoordinates)

    setRemotePainter(remotePainter)
  }, [])

  useEffect(() => {
    if (!name || !roomId)
      return

    const localEventSerializer = new PaintEventSerializer(NormalizeCoordinates)
    const pointerPainter = new PointerPainterController(name, true);
    attachEventSerializer(pointerPainter, localEventSerializer)

    localEventSerializer.on('event', payload => {
      sendPointerEvent(roomId, payload)
    })

    setPointerPainter(pointerPainter)
  }, [roomId, name])

  useEffect(() => {
    if (pointerPainter) {
      pointerPainter.setBrush(brushParameters)
    }
  }, [pointerPainter, brushParameters])

  const setBrushAction = useCallback(
    (brush: BrushParameters) => {
      setBrushParameters(brush);
    },
    [setBrushParameters]
  );

  const clearAction = useCallback(() => {
    if (pointerPainter) {
      pointerPainter.clear()
    }
  }, [pointerPainter]);

  const WhiteboardProviderActions = {
    clear: clearAction,
    setBrush: setBrushAction,
  };

  return (
    <Context.Provider value={{
      state: {
        loading,
        pointerPainter,
        remotePainter,
        brushParameters
    }, actions: WhiteboardProviderActions }}>
      {children}
    </Context.Provider>
  );
}

export function useWhiteboard(): IWhiteboardContext {
    return useContext(Context);
}

export default WhiteboardContextProvider;
