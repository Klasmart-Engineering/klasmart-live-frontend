import React, { ReactChild, ReactNode, useContext, useMemo } from "react";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { whiteboard } from "../../utils/layerValues";
import { useSynchronizedState } from "../context-providers/SynchronizedStateProvider";
import { WhiteboardCanvas } from "kidsloop-canvas/lib/domain/whiteboard/WhiteboardCanvas";
import { UserContext } from "../../entry";

type Props = {
    uniqueId: string;
    group?: string;
    children?: ReactChild | ReactNode | null;
    width?: string | number; // In student case, activity's width should be passed
    height: string | number;
    filterUsers?: string[];
    filterGroups?: string[];
    centerHorizontally?: boolean;
    centerVertically?: boolean;
}

export function Whiteboard({ group, children, width, height, filterUsers, filterGroups, uniqueId, centerHorizontally, centerVertically }: Props): JSX.Element {
    const { state: { permissions, display } } = useSynchronizedState();

    const { sessionId } = useContext(UserContext);

    const canvasUserId = useMemo(() => {
        if (group) {
            return `${sessionId}:${group}`;
        } else {
            return sessionId;
        }

    }, [sessionId, group]);

    const canvasStyle: CSSProperties = {
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
                overflow: "hidden",
            }}
        >
            <WhiteboardCanvas instanceId={`canvas:user:${sessionId}:${uniqueId}`}
                userId={canvasUserId}
                pointerEvents={permissions.allowCreateShapes}
                initialStyle={canvasStyle}
                filterUsers={filterUsers}
                filterGroups={filterGroups}
                pixelWidth={1024}
                pixelHeight={1024}
                display={display}
                scaleMode={"ScaleFitHorizontally"}
                centerHorizontally={centerHorizontally !== undefined ? centerHorizontally : true}
                centerVertically={centerVertically !== undefined ? centerVertically : false}
            />
            {children}

        </div>
    );
}
