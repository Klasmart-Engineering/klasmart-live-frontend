import React, { ReactChild, ReactNode } from "react";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { useWhiteboard } from "../context-provider/WhiteboardContextProvider";
import { ShapeDrivenCanvas } from "./ShapeDrivenCanvas";
import { whiteboard } from "../../utils/layerValues";

type Props = {
    children?: ReactChild | ReactNode | null;
    width?: string | number; // In student case, activity's width should be passed
    height: string | number;
    filterUsers?: string[];
}

export function Whiteboard({ children, width, height, filterUsers }: Props): JSX.Element {
    const { state } = useWhiteboard();

    const canvasStyle: CSSProperties = {
        border: "2px blue solid",
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        zIndex: whiteboard,
    };

    const pointerEvents = state.permissions.allowCreateShapes ? undefined : "none";

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
            <ShapeDrivenCanvas enablePointer={state.permissions.allowCreateShapes}
                width="1024" height="1024"
                style={{ ...canvasStyle, height, pointerEvents: pointerEvents, display: state.display ? "inline-block" : "none" }}
                filterUsers={filterUsers} />
            {children}
        </div>
    );
}
