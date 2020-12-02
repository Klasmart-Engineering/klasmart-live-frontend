import React, { useState, useEffect, useContext, useRef } from "react";
import { useSelector } from "react-redux";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Grid from "@material-ui/core/Grid";
import IframeResizer from "iframe-resizer-react";

import { WBToolbarContainer, WB_TOOLBAR_MAX_HEIGHT, MOBILE_WB_TOOLBAR_MAX_HEIGHT } from "./WBToolbar"
import { UserContext } from "../../entry";
import { State } from "../../store/store";
import { ClassType } from "../../store/actions";
import { Whiteboard } from "../../whiteboard/components/Whiteboard-new";

export const DRAWER_TOOLBAR_WIDTH = 64;

export function ClassContentContainer({ materialKey }: { materialKey: number }) {
    const { classType } = useContext(UserContext);
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    const drawerOpen = useSelector((state: State) => state.control.drawerOpen);

    return (
        <Grid
            id="class-content-container"
            component="main"
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            item xs={drawerOpen ? 9 : 12}
            key={materialKey}
            style={{
                padding: isSmDown ? theme.spacing(1) : theme.spacing(2),
                paddingRight: (isSmDown ? theme.spacing(1) : theme.spacing(2)) + (classType === ClassType.STUDY ? 0 : DRAWER_TOOLBAR_WIDTH),
            }}
        >
            <ClassContent />
            <WBToolbarContainer />
        </Grid>
    )
}

interface NewProps extends IframeResizer.IframeResizerProps { forwardRef: any }
const IframeResizerNew = IframeResizer as React.FC<NewProps>

function ClassContent() {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
    const { materials } = useContext(UserContext);
    const contentIndex = useSelector((store: State) => store.control.contentIndex)
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [squareSize, setSquareSize] = useState<number>(0);

    useEffect(() => {
        if (!rootDivRef || !rootDivRef.current) { return; }
        const width = rootDivRef.current.clientWidth;
        const height = rootDivRef.current.clientHeight;
        if (!width || !height) { return; }
        else if (width > height) { setSquareSize(height); }
        else { setSquareSize(width); }
    }, [rootDivRef.current]);

    return (
        <Grid
            id="class-content"
            item xs={12}
            style={{
                maxWidth: "100%",
                height: `calc(100% - ${isSmDown ? MOBILE_WB_TOOLBAR_MAX_HEIGHT : WB_TOOLBAR_MAX_HEIGHT}px)`,
                maxHeight: `calc(100% - ${isSmDown ? MOBILE_WB_TOOLBAR_MAX_HEIGHT : WB_TOOLBAR_MAX_HEIGHT}px)`,
                overflow: "hidden",
                // overflowY: interactiveMode === 2 ? "auto" : "hidden" // For Observe mode
            }}
        >
            {/* TODO (Isu): Make below as component  */}
            <Grid
                id="classes-content-container"
                ref={rootDivRef}
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                item
                xs={12}
                style={{ width: "100%", height: "100%" }}
            >
                <Grid
                    item
                    style={squareSize ? {
                        position: "relative",
                        margin: "0 auto",
                        width: squareSize,
                        height: squareSize
                    } : {
                            position: "relative",
                            margin: "0 auto",
                            height: "100%"
                        }
                    }>
                    <Whiteboard uniqueId="teacher" />
                    <IframeResizerNew
                        draggable
                        scrolling
                        forwardRef={iframeRef}
                        src={`${materials[contentIndex].url}`}
                        style={{ width: "100%", height: "100%" }}
                    />
                </Grid>
            </Grid>
        </Grid>
    )
}