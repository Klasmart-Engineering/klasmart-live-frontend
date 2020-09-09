import React, { ReactChild, ReactNode, useContext } from "react";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { whiteboard } from "../../utils/layerValues";
import { useSynchronizedState } from "../context-providers/SynchronizedStateProvider";
import { WhiteboardCanvas } from "kidsloop-canvas/lib/domain/whiteboard/WhiteboardCanvas";
import { UserContext } from "../../entry";

type Props = {
    uniqueId: string;
    children?: ReactChild | ReactNode | null;
    width?: string | number; // In student case, activity's width should be passed
    height: string | number;
    filterUsers?: string[];
}

export function Whiteboard({ children, width, height, filterUsers, uniqueId }: Props): JSX.Element {
    const { state: { permissions, display } } = useSynchronizedState();

    const { sessionId } = useContext(UserContext);

    const canvasStyle: CSSProperties = {
        border: "2px blue solid",
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        zIndex: whiteboard,
        height: "100%",
    };

    // TODO: Proper resolution/aspect ratio/size support. May have to
    // poll the parent element size to proper calculate and set it.

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                alignItems: "center", // Center <IframeResizer />
                height,
                position: "relative",
                width: width ? width : "100%",
            }}
        >
            <WhiteboardCanvas instanceId={`canvas:user:${sessionId}:${uniqueId}`}
                userId={sessionId}
                pointerEvents={permissions.allowCreateShapes}
                initialStyle={canvasStyle}
                filterUsers={filterUsers}
                pixelWidth={1024}
                pixelHeight={1024}
                display={display}
                scaleMode={"ScaleToFit"}
                centerHorizontally={true}
                centerVertically={false}
            />
            {children}

        </div>
    );
}
