import React, { ReactChild, ReactNode } from "react";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { useWhiteboard } from "../context-provider/WhiteboardContextProvider";
import { EventDrivenCanvas } from "./EventDrivenCanvas";
import zIndex from "@material-ui/core/styles/zIndex";

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
}

export function Whiteboard({ children, height }: Props): JSX.Element {
    const { state } = useWhiteboard();
    console.log(`height as prop: ${height}`);
  
    return (
        <div style={{position:"relative", width: "100%" }}>
            <EventDrivenCanvas width="1024" height="1024" style={{ ...canvasStyle, pointerEvents: "none", height }} controller={state.remotePainter} />
            <EventDrivenCanvas enablePointer={true} width="1024" height="1024" style={{...canvasStyle, height}} controller={state.pointerPainter} />
            {children}
        </div>
    );
}
