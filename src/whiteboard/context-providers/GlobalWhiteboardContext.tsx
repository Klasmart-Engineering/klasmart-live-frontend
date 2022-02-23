import WhiteboardStateProvider,
{ useSynchronizedState } from "./SynchronizedStateProvider";
import KidsLoopCanvas from "@kl-engineering/kidsloop-canvas";
import ToolbarContextProvider from "@kl-engineering/kidsloop-canvas/lib/components/toolbar/toolbar-context-provider";
import WhiteboardEventSerializer from "@kl-engineering/kidsloop-canvas/lib/domain/whiteboard/SharedEventSerializerProvider";
import React,
{
    FunctionComponent,
    ReactChild,
    ReactChildren,
} from "react";

type Props = {
    children?: ReactChild | ReactChildren | null | any;
};

const CanvasStateAndSynchronization: FunctionComponent<Props> = ({ children }: Props): JSX.Element => {
    return (
        <WhiteboardEventSerializer>
            <WhiteboardStateProvider>
                {children}
            </WhiteboardStateProvider>
        </WhiteboardEventSerializer>
    );
};

const CanvasWhiteboardAndToolbar: FunctionComponent<Props> = ({ children }: Props): JSX.Element => {

    const { state: { permissions } } = useSynchronizedState();

    return (
        <KidsLoopCanvas.WhiteboardProvider permissions={{
            allowClearAll: permissions.allowDeleteShapes.others && permissions.allowDeleteShapes.own,
            allowClearMyself: permissions.allowDeleteShapes.own,
            allowClearOthers: permissions.allowDeleteShapes.others,
        }}
        >
            <ToolbarContextProvider>
                {children}
            </ToolbarContextProvider>
        </KidsLoopCanvas.WhiteboardProvider>
    );
};

export const GlobalWhiteboardContext: FunctionComponent<Props> = ({ children }: Props): JSX.Element => {

    return (
        <CanvasStateAndSynchronization>
            <CanvasWhiteboardAndToolbar>
                {children}
            </CanvasWhiteboardAndToolbar>
        </CanvasStateAndSynchronization>
    );
};
