import React, { ReactChild, ReactNode } from "react";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { useWhiteboard } from "../context-provider/WhiteboardContextProvider";
import { EventDrivenCanvas } from "./EventDrivenCanvas";



type Props = {
  children?: ReactChild | ReactNode | null;
  height: string | number;
}

export function Whiteboard({ children, height }: Props): JSX.Element {
    const { state } = useWhiteboard();

    const canvasStyle: CSSProperties = {
        border: "2px blue solid",
        position: "absolute",
        top: "0px",
        left: "0px",
        width: "100%",
        zIndex: 998,
    };
  
    const pointerEvents = state.permissions.allowCreateShapes ? undefined : "none";

    return (
        <div style={{position:"relative", width: "100%"}}>
            <EventDrivenCanvas width="1024" height="1024" style={{ ...canvasStyle, pointerEvents: "none", height, display: state.display ? "inline-block" : "none" }} controller={state.remotePainter} />
            <EventDrivenCanvas enablePointer={state.permissions.allowCreateShapes} width="1024" height="1024" style={{...canvasStyle, height, pointerEvents: pointerEvents, display: state.display ? "inline-block" : "none"}} controller={state.pointerPainter} />
            {children}
        </div>
    );
}
