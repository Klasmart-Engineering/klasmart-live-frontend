import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import IframeResizer from "iframe-resizer-react";
import { useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";

import ArrowBackIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIcon from "@material-ui/icons/ArrowForwardIos";
import { DoorOpen as ExitIcon } from "@styled-icons/bootstrap/DoorOpen";

import { Whiteboard } from "../../whiteboard/components/Whiteboard";
import Loading from "../../components/loading";
import { State } from "../../store/store";
import { setContentIndex } from "../../store/reducers/control";
import { useHttpEndpoint } from "../../context-provider/region-select-context";
import { useServices } from "../../context-provider/services-provider";
import { useUserContext } from "../../context-provider/user-context";
import { MaterialTypename } from "../../lessonMaterialContext";
import { ContentResponse } from "../../services/cms/IContentService";
import StyledFAB from "../../components/styled/fabButton";
import StyledIcon from "../../components/styled/icon";
interface NewProps extends IframeResizer.IframeResizerProps {
    forwardRef: any
}
const IframeResizerNew = IframeResizer as React.FC<NewProps>

const initialHref = location.href;

export default function Study(): JSX.Element {
    const theme = useTheme();
    const dispatch = useDispatch();
    const { materials } = useUserContext();
    const firstIndexOfFeaturedContents = materials.length;

    const { contentService } = useServices();
    const selectedOrg = useSelector((state: State) => state.session.selectedOrg);
    const contentIndex = useSelector((store: State) => store.control.contentIndex)

    const rootDivRef = useRef<HTMLDivElement>(null);
    const [contentWidth, setContentWidth] = useState<number>(0);
    const [contentHeight, setContentHeight] = useState<number>(0);
    const [contentUrl, setContentUrl] = useState<string>("");
    const [featuredContents, setFeaturedContents] = useState<ContentResponse[]>([]);
    const liveContentEndpoint = useHttpEndpoint("live");

    useEffect(() => {
        dispatch(setContentIndex(0));
    }, [])

    useEffect(() => {
        async function fetchEverything() {
            async function fetchAllLessonMaterials() {
                if (!contentService) return;
                const payload = await contentService.getFeaturedContents(selectedOrg.organization_id);
                if (payload.err) {
                    console.error(payload.err.message);
                }
                setFeaturedContents(payload.list);
            }
            try {
                await Promise.all([fetchAllLessonMaterials()])
            } catch (err) {
                console.error(`Fail to fetchAllLessonMaterials: ${err}`)
            } finally { }
        }
        fetchEverything();
    }, [contentService])

    useEffect(() => {
        if (featuredContents.length === 0) { return }
    }, [featuredContents])

    useEffect(() => {
        if (!rootDivRef || !rootDivRef.current) { return; }
        const width = rootDivRef.current.clientWidth;
        const height = rootDivRef.current.clientHeight;
        if (!width || !height) { return; }
        setContentWidth(width);
        setContentHeight(height);
    }, [rootDivRef.current]);

    useEffect(() => {
        if (contentIndex >= materials.length) { return; }
        if (materials[contentIndex].__typename === MaterialTypename.Iframe) {
            setContentUrl(`${liveContentEndpoint}${materials[contentIndex].url}`);
        } else {
            setContentUrl(`${materials[contentIndex].url}`);
        }
    }, [contentIndex])

    const restart = useCallback(() => {
        const app = (navigator as any).app;
        if (app) {
            app.loadUrl(initialHref, { wait: 0, loadingDialog: "Wait, Loading App", loadUrlTimeoutValue: 60000 });
        }
        else {
            (navigator as any).splashscreen.show();
            location.href = initialHref;
        }
    }, []);

    const handleClickPrevMaterial = () => {
        // TODO (Isu):
        // 1. UI for "First Lesson Material" when contentIndex === 0
        // 2. UI for "Lesson Plan Completed" when contentIndex === firstIndexOfFeaturedContents
        dispatch(setContentIndex(contentIndex - 1));
    }

    const handleClickNextMaterial = () => {
        dispatch(setContentIndex(contentIndex + 1));
    }

    return (
        <Grid
            id="study-content-container"
            ref={rootDivRef}
            container
            direction="row"
            justify="space-between"
            alignItems="center"
            item
            xs={12}
            style={{ width: "100%", height: "100%", backgroundColor: "white" }}
        >
            <Grid item xs={1}>
                <IconButton
                    aria-label="go to prev activity"
                    disabled={
                        contentIndex <= 0 ||
                        contentIndex === firstIndexOfFeaturedContents // Students don't need to back to completed Lesson Plan already
                    }
                    onClick={handleClickPrevMaterial}
                >
                    <ArrowBackIcon fontSize="large" />
                </IconButton>
            </Grid>
            <Grid
                item
                xs={10}
                style={{
                    position: "relative",
                    margin: "0 auto",
                    height: "100%",
                }}
            >
                {!contentWidth || !contentHeight ? <Loading messageId="loading_text" /> :
                    <StudyContent
                        contentUrl={contentIndex < materials.length
                            ? contentUrl
                            : `${liveContentEndpoint}/h5p/play/${JSON.parse(featuredContents[contentIndex - materials.length].data).source}`
                        }
                    />}
            </Grid>
            <Grid item xs={1}>
                <IconButton
                    aria-label="go to next activity"
                    disabled={contentIndex >= (materials.length + featuredContents.length - 1)}
                    onClick={handleClickNextMaterial}
                >
                    <ArrowForwardIcon fontSize="large" />
                </IconButton>
            </Grid>
            <StyledFAB
                aria-label="exit study button"
                size="large"
                onClick={() => restart()}
                style={{
                    display: contentIndex >= firstIndexOfFeaturedContents ? "block" : "none",  // Students can't exit Study session until they finish their homework
                    backgroundColor: "transparent",
                    position: "fixed",
                    top: theme.spacing(1),
                    right: theme.spacing(1)
                }}
            >
                <StyledIcon icon={<ExitIcon />} size="large" color="#000000" />
            </StyledFAB>
        </Grid>
    )
}

// TODO (Isu): Resizing
function StudyContent({ contentUrl }: { contentUrl: string }) {
    const { sessionId } = useUserContext();
    const iframeRef = useRef<HTMLIFrameElement>(null);

    return (<>
        <Whiteboard group={sessionId} uniqueId={`student-study`} filterGroups={[sessionId]} />
        <IframeResizerNew
            id="resized-iframe"
            allow="microphone"
            forwardRef={iframeRef}
            src={contentUrl}
            checkOrigin={false}
            scrolling
            draggable
            style={{
                width: "100%",
                height: "100%"
            }}
        />
    </>)
}

function FeaturedContent({ contentUrl }: { contentUrl: string }) {
    const iframeRef = useRef<HTMLIFrameElement>(null);

    return (
        <IframeResizerNew
            id="resized-iframe"
            allow="microphone"
            forwardRef={iframeRef}
            src={contentUrl}
            checkOrigin={false}
            scrolling
            draggable
            style={{
                width: "100%",
                height: "100%"
            }}
        />
    )
}