import React, { createContext, FunctionComponent, useCallback, useContext, useEffect, useState, ReactChild, ReactChildren } from 'react';
import { BrushParameters } from '../services/brush/BrushParameters';
import { PointerPainterController } from '../controller/PointerPainterController';
import { EventPainterService } from '../services/EventPainterService';
import { useWhiteboardGraphQL } from '../hooks/WhiteboardGraphQL';
import { EventPainterController } from '../controller/EventPainterController';
import { PainterEvent } from '../services/PainterEvent';

interface IWhiteboardState {
  brushParameters: BrushParameters;
  pointerPainter?: PointerPainterController;
  remotePainter?: EventPainterController;
  localPainterService?: EventPainterService;
  remotePainterService?: EventPainterService
}

interface IWhiteboardContext {
  state: IWhiteboardState;
  actions: any;
}

const Context = createContext<IWhiteboardContext>({
  state: {brushParameters: BrushParameters.default()},
  actions: {},
});

type Props = {
  children?: ReactChild | ReactChildren | null
  roomId?: string
  sessionId?: string
}

// NOTE: This is used to scale up the coordinates sent in events
// to save bytes in the text representation of numbers. E.g. 33
// instead of 0.0333333333. Sacrificing some sub-pixel accuracy.
const NormalizeCoordinates = 1000;

export const WhiteboardProvider: FunctionComponent<Props> = ({ children, sessionId, roomId }: Props) : JSX.Element => {
  const [context, setContext] = useState<IWhiteboardState>({brushParameters: BrushParameters.default()});

  const handleIncomingEvent = useCallback((event: PainterEvent) => {
    if (context.remotePainter) {
      console.log(event)
      context.remotePainter.handlePainterEvent(event)
    }
  }, [context.remotePainter])

  const sendPointerEvent = useWhiteboardGraphQL(roomId, event => {
    handleIncomingEvent(event)
  })

  useEffect(() => {
    if (sessionId === undefined)
      sessionId = ''
    
    if (roomId === undefined)
      roomId = ''

    const brushParameters = BrushParameters.default()
    
    const localPainterService = new EventPainterService(NormalizeCoordinates)
    const pointerPainter = new PointerPainterController(sessionId, true);
    pointerPainter.on('operationBegin', (id, params) => {
      localPainterService.operationBegin(id, params)
    })
    pointerPainter.on('operationEnd', id => {
      localPainterService.operationEnd(id)
    })
    pointerPainter.on('painterClear', id => {
      localPainterService.painterClear(id)
    })
    pointerPainter.on('painterLine', (id, p1, p2) => {
      localPainterService.painterLine(id, p1, p2)
    })

    localPainterService.on('event', payload => {
      sendPointerEvent(payload)
    })

    pointerPainter.setBrush(brushParameters);

    const remotePainterService = new EventPainterService(NormalizeCoordinates)
    const remotePainter = new EventPainterController(NormalizeCoordinates)
    remotePainter.on('operationBegin', (id, params) => {
      remotePainterService.operationBegin(id, params)
    })
    remotePainter.on('operationEnd', id => {
      remotePainterService.operationEnd(id)
    })
    remotePainter.on('painterClear', id => {
      remotePainterService.painterClear(id)
    })
    remotePainter.on('painterLine', (id, p1, p2) => {
      remotePainterService.painterLine(id, p1, p2)
    })

    const context = {
      brushParameters,
      pointerPainter,
      remotePainter,
      localPainterService,
      remotePainterService
    }

    setContext(context)
  }, [roomId, sessionId])

  const setBrushAction = useCallback(
    (brush: BrushParameters) => {
      const newContext = { ...context };
      newContext.brushParameters = brush;

      if (newContext.pointerPainter) {
        newContext.pointerPainter.setBrush(brush)
      }

      setContext(newContext);
    },
    [context]
  );

  const clearAction = useCallback(() => {
    if (context.pointerPainter) {
      context.pointerPainter.clear()
    }
  }, [context]);

  const WhiteboardProviderActions = {
    clear: clearAction,
    setBrush: setBrushAction,
  };

  return (
    <Context.Provider value={{ state: context, actions: WhiteboardProviderActions }}>
      {children}
    </Context.Provider>
  );
}

export function useWhiteboard(): IWhiteboardContext {
  return useContext(Context);
}

export default WhiteboardProvider
