import React, { useState, useEffect, useContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import IframeResizer from "iframe-resizer-react";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import ArrowBackIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIcon from '@material-ui/icons/ArrowForwardIos';

import { WBToolbarContainer, WB_TOOLBAR_MAX_HEIGHT } from "./WBToolbar"
import { LocalSessionContext } from "../../entry";
import { State } from "../../store/store";
import { ClassType } from "../../store/actions";
import { Whiteboard } from "../../whiteboard/components/Whiteboard-new";
import { setContentIndex } from "../../store/reducers/control";
import { ResizedIframe } from "../resizedIframe";

export const DRAWER_TOOLBAR_WIDTH = 64;

export function ClassContentContainer({ materialKey, recommandUrl }: {
    materialKey: number,
    recommandUrl?: string,
}) {
    const { classtype } = useContext(LocalSessionContext);
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
                paddingRight: (isSmDown ? theme.spacing(1) : theme.spacing(2)) + (classtype === ClassType.STUDY ? 0 : DRAWER_TOOLBAR_WIDTH),
            }}
        >
            <ClassContent recommandUrl={recommandUrl} />
            <WBToolbarContainer />
        </Grid>
    )
}

interface NewProps extends IframeResizer.IframeResizerProps { forwardRef: any }
const IframeResizerNew = IframeResizer as React.FC<NewProps>

function ClassContent({ recommandUrl }: {
    recommandUrl?: string
}) {
    const { classtype, isTeacher, materials } = useContext(LocalSessionContext);

    const iframeRef = useRef<HTMLIFrameElement>(null);

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [squareSize, setSquareSize] = useState<number>(0);

    const forStudent = classtype === ClassType.STUDY || !isTeacher;

    const dispatch = useDispatch();
    const contentIndex = useSelector((store: State) => store.control.contentIndex);

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
                height: `calc(100% - ${WB_TOOLBAR_MAX_HEIGHT}px)`,
                maxHeight: `calc(100% - ${WB_TOOLBAR_MAX_HEIGHT}px)`,
                overflow: "hidden",
                // overflowY: interactiveMode === 2 ? "auto" : "hidden" // For Observe mode
            }}
        >
            <Grid
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
                    container
                    justify="center"
                    item
                    xs={1}
                >
                    <IconButton disabled={contentIndex <= 0} aria-label="go to prev activity" onClick={() => dispatch(setContentIndex(contentIndex - 1))}>
                        <ArrowBackIcon fontSize="large" />
                    </IconButton>
                </Grid>
                <Grid
                    id="classes-content-container"
                    item
                    xs={10}
                    style={{
                        position: "relative",
                        margin: "0 auto",
                        height: "100%"
                    }}
                >
                    <Whiteboard uniqueId={forStudent ? "student" : "teacher"} />
                    <ResizedIframe contentId={contentIndex >= materials.length ? `${recommandUrl}` : `${materials[contentIndex].url}`} />
                </Grid>
                <Grid
                    container
                    justify="center"
                    item
                    xs={1}
                >
                    <IconButton disabled={contentIndex >= (recommandUrl ? materials.length : materials.length - 1)} aria-label="go to next activity" onClick={() => dispatch(setContentIndex(contentIndex + 1))}>
                        <ArrowForwardIcon fontSize="large" />
                    </IconButton>
                </Grid>
            </Grid>
        </Grid>
    )
}