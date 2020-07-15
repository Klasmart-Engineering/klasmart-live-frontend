import React, { ReactChild, ReactChildren, ReactNode } from "react";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { useWhiteboard } from "../context-provider/WhiteboardContextProvider";
import { EventDrivenCanvas } from "./EventDrivenCanvas";

const canvasStyle: CSSProperties = {
    border: "2px blue solid",
    display: "inline-block",
    position: "absolute",
    top: "0px",
    left: "0px",
    width: "100%",
    height: "100%"
};

type Props = {
  children?: ReactChild | ReactNode | null
}

export function Whiteboard({ children }: Props): JSX.Element {
    const { state } = useWhiteboard();
  
    return (
        <div style={{position:"relative", width: "100%"}}>
            <EventDrivenCanvas width="1024" height="1024" style={{ ...canvasStyle, pointerEvents: "none" }} controller={state.remotePainter} />
            <EventDrivenCanvas enablePointer={true} width="1024" height="1024" style={canvasStyle} controller={state.pointerPainter} />
            {children}
        </div>
    );
}
