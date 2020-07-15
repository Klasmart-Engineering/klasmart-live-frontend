import React, { ReactChild, ReactNode } from "react";
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
    zIndex: 998,
};

type Props = {
  children?: ReactChild | ReactNode | null;
  height: string | number;
  display?: boolean;
  allowPainting?: boolean;
}

export function Whiteboard({ children, height, display, allowPainting }: Props): JSX.Element {
    const { state } = useWhiteboard();
  
    const pointerEvents = allowPainting ? undefined : "none";

    return (
        <div style={{position:"relative", width: "100%", display: "none"}}>
            <EventDrivenCanvas width="1024" height="1024" style={{ ...canvasStyle, pointerEvents: "none", height }} controller={state.remotePainter} />
            <EventDrivenCanvas enablePointer={allowPainting} width="1024" height="1024" style={{...canvasStyle, height, pointerEvents: pointerEvents}} controller={state.pointerPainter} />
            {children}
        </div>
    );
}
