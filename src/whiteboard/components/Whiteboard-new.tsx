// This is temporary and will be removed after the App and Web merge.

import React, { CSSProperties, useMemo } from "react";
import { whiteboard } from "../../utils/layerValues";
import { useSynchronizedState } from "../context-providers/SynchronizedStateProvider";
import { WhiteboardCanvas } from "kidsloop-canvas/lib/domain/whiteboard/WhiteboardCanvas";
import { useSessionContext } from "../../context-provider/session-context";

type Props = {
    uniqueId: string;
    group?: string;
    width?: string | number; // In student case, activity's width should be passed
    height?: string | number;
    filterUsers?: string[];
    filterGroups?: string[];
    centerHorizontally?: boolean;
    centerVertically?: boolean;
}

export function Whiteboard({ group, width, height, filterUsers, filterGroups, uniqueId, centerHorizontally, centerVertically }: Props): JSX.Element {
    const { state: { permissions, display } } = useSynchronizedState();

    const { sessionId } = useSessionContext();

    const canvasUserId = useMemo(() => {
        if (group) {
            return `${sessionId}:${group}`;
        } else {
            return sessionId;
        }

    }, [sessionId, group]);

    const canvasStyle: CSSProperties = {
        zIndex: whiteboard,
        width: "100%",
        height: "100%",
    };

    return (
        <div
            id="whiteboard-container"
            style={{
                // zIndex: whiteboard + 1, // need it?
                display: display ? "block" : "none",
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                width: width ? width : "100%",
                height: height ? height : "100%",
            }}
        >
            <WhiteboardCanvas
                instanceId={`canvas:user:${sessionId}:${uniqueId}`}
                userId={canvasUserId}
                pointerEvents={permissions.allowCreateShapes}
                initialStyle={canvasStyle}
                filterUsers={filterUsers}
                filterGroups={filterGroups}
                pixelWidth={1024}
                pixelHeight={1024}
                display={display}
                scaleMode={"ScaleToFill"}
                centerHorizontally={centerHorizontally !== undefined ? centerHorizontally : true}
                centerVertically={centerVertically !== undefined ? centerVertically : false}
            />
        </div>
    );
}
