import { gql, useMutation } from "@apollo/client";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Refresh as RefreshIcon } from "@styled-icons/material/Refresh";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import CurlySpinner1 from "../assets/img/spinner/curly1_spinner.gif";
import CurlySpinner2 from "../assets/img/spinner/curly2_spinner.gif";
import EccoSpinner1 from "../assets/img/spinner/ecco1_spinner.gif";
import EccoSpinner2 from "../assets/img/spinner/ecco2_spinner.gif";
import GhostSpinner from "../assets/img/spinner/ghost_spinner.gif";
import JessSpinner1 from "../assets/img/spinner/jess1_spinner.gif";
import MimiSpinner1 from "../assets/img/spinner/mimi1_spinner.gif";
import { SESSION_LINK_LIVE } from "../context-provider/live-session-link-context";
import { useHttpEndpoint } from "../context-provider/region-select-context";
import { useSessionContext } from "../context-provider/session-context";
import { ClassType } from "../store/actions";
import { State } from "../store/store";
import { injectIframeScript } from "../utils/injectIframeScript";
import { loadingActivity } from "../utils/layerValues";
import StyledFAB from "./styled/fabButton";

const SET_STREAMID = gql`
    mutation setSessionStreamId($roomId: ID!, $streamId: ID!) {
        setSessionStreamId(roomId: $roomId, streamId: $streamId)
    }
`;

export interface Props {
    contentHref: string;
    setStreamId: React.Dispatch<React.SetStateAction<string | undefined>>;
    width: number;
    height: number;
}

enum LoadStatus {
    Error,
    Loading,
    Finished,
}

export function RecordedIframe(props: Props): JSX.Element {
    const SPINNER = [CurlySpinner1, CurlySpinner2, EccoSpinner1, EccoSpinner2, JessSpinner1, MimiSpinner1];
    const MAX_LOADING_COUNT = 60
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const { roomId, token, classType } = useSessionContext();
    const drawerOpen = useSelector((state: State) => state.control.drawerOpen);
    const { contentHref, setStreamId, width, height } = props;
    const [sendStreamId] = useMutation(SET_STREAMID, { context: { target: SESSION_LINK_LIVE } });

    const isPdfContent = contentHref.endsWith(`.pdf`);

    const [transformScale, setTransformScale] = useState<number>(1);
    const [openDialog, setOpenDialog] = useState(true);
    const [seconds, setSeconds] = useState(MAX_LOADING_COUNT);
    const [loadStatus, setLoadStatus] = useState(LoadStatus.Loading);
    const [intervalId] = useState<number>();
    const [contentWidth, setContentWidth] = useState(1600);
    const [contentHeight, setContentHeight] = useState(1400);
    const [enableResize, setEnableResize] = useState(true);

    const recorderEndpoint = useHttpEndpoint("live");

    const contentHrefWithToken = useMemo<string>(() => {
        const encodedEndpoint = encodeURIComponent(recorderEndpoint);
        if (contentHref.endsWith(`.pdf`)) {
            return `pdfviewer.html?pdfSrc=${contentHref}&token=${token}&endpoint=${encodedEndpoint}`;
        } else {
            return `${contentHref}?token=${token}&endpoint=${encodedEndpoint}`;
        }
    }, [contentHref, token, recorderEndpoint]);

    useEffect(() => {
        scale(contentWidth, contentHeight);
        if (classType == ClassType.LIVE) {
            setTimeout(() => {
                scaleWhiteboard();
            }, 300);
        }
    }, [width, height, contentWidth, contentHeight]);

    useEffect(() => {
        setTimeout(() => {
            window.dispatchEvent(new Event(`resize`));
        }, 300)
    }, [drawerOpen])

    useEffect(() => {
        setSeconds(MAX_LOADING_COUNT);
        setLoadStatus(LoadStatus.Loading);
    }, [contentHref]);

    useEffect(() => {
        if (loadStatus === LoadStatus.Loading) {
            setOpenDialog(true);
            const interval = window.setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
        } else if (loadStatus === LoadStatus.Finished) {
            setOpenDialog(false);
            clearInterval(intervalId);
            onLoad();
            startRecording();
        } else if (seconds <= 0 || loadStatus === LoadStatus.Error) {
            clearInterval(intervalId);
        }

        return () => clearInterval(intervalId);
    }, [loadStatus]);

    const scale = (innerWidth: number, innerHeight: number) => {
        const shrinkRatioX = width / innerWidth;
        const shrinkRatioY = height / innerHeight;
        const shrinkRatio = Math.min(shrinkRatioX, shrinkRatioY);
        setTransformScale(shrinkRatio);
    }

    const scaleWhiteboard = () => {
        const recordediframe = window.document.getElementById(`recordediframe`) as HTMLIFrameElement;
        const recordediframeStyles = recordediframe?.getAttribute(`style`);
        const whiteboard = window.document.getElementsByClassName(`canvas-container`)[0];
        if (recordediframeStyles && whiteboard) {
            whiteboard.setAttribute(`style`, recordediframeStyles);
        }
    };

    function onLoad() {
        // TODO the client-side rendering version of H5P is ready! we can probably delete this function and the scale function above
        // if we switch over to it! Ask me (Daiki) about the details.
        const iframeElement = window.document.getElementById("recordediframe") as HTMLIFrameElement;
        const contentWindow = iframeElement.contentWindow
        const contentDoc = iframeElement.contentDocument
        if (!contentWindow || !contentDoc) { return; }
        // IP Protection: Contents should not be able to be downloaded by right-clicking.
        const blockRightClick = (e: MouseEvent) => { e.preventDefault() }
        contentWindow.addEventListener("contextmenu", (e) => blockRightClick(e), false);
        const h5pDivCollection = contentDoc.body.getElementsByClassName("h5p-content");
        const h5pTypeColumn = contentDoc.body.getElementsByClassName("h5p-column").length;
        const firstElementChild = contentDoc.body.firstElementChild;
        const firstTagName = firstElementChild?.tagName.toLowerCase();

        //Some contents are auto scale with iframe size. So, There don't need to be resized.
        if (h5pTypeColumn || isPdfContent || firstTagName === 'video') {
            setEnableResize(false)
        } else {
            setEnableResize(true)
        }

        if (h5pDivCollection.length > 0) {
            const h5pContainer = h5pDivCollection[0] as HTMLDivElement;

            if (h5pTypeColumn) {
                h5pContainer.setAttribute("style", "width: 100% !important;");
            } else {
                h5pContainer.setAttribute("style", "width: auto !important;");
            }

            h5pContainer.setAttribute("data-iframe-height", "");
            const h5pWidth = h5pContainer.getBoundingClientRect().width;
            const h5pHeight = h5pContainer.getBoundingClientRect().height;
            setContentWidth(h5pWidth);
            setContentHeight(h5pHeight);
        }else{
            //Some contents isn't H5P, there are dynamically sized and hard to control. We need to calculate separately
            switch (firstTagName){
                case 'img':
                    setContentWidth(firstElementChild ? firstElementChild.getBoundingClientRect().width : width);
                    setContentHeight(firstElementChild ? firstElementChild.getBoundingClientRect().height: height);
                    break;
                //TODO: Calculate the size of other special content here
            }

        }

        // Listen to acvitity clicks (that change the height of h5p)
        contentDoc.addEventListener('mouseup', function () {
            setTimeout(function () {
                const h5pContainer = h5pDivCollection[0] as HTMLDivElement;
                h5pContainer.setAttribute("data-iframe-height", "");
                const h5pWidth = h5pContainer.getBoundingClientRect().width;
                const h5pHeight = h5pContainer.getBoundingClientRect().height;

                setContentWidth(h5pWidth);
                setContentHeight(h5pHeight);
            }, 2000);
        }, false);

        if (!isPdfContent) {
            injectIframeScript(iframeElement, "h5presize");
        }
    }

    useEffect(() => {
        function onMessage({ data }: MessageEvent) {
            if (data && data.streamId) {
                if (setStreamId) { setStreamId(data.streamId); }
                sendStreamId({
                    variables: {
                        roomId,
                        streamId: data.streamId,
                    },
                });
            }
        }

        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
    }, [iframeRef.current]);

    function startRecording() {
        try {
            const iRef = window.document.getElementById("recordediframe") as HTMLIFrameElement;
            if (!iRef ||
                !iRef.contentWindow ||
                (iRef.contentWindow as any).kidslooplive ||
                !iRef.contentDocument) { return; }

            injectIframeScript(iRef, "record");
        } catch (error) {
            console.error(error);
        }
    }

    const getRandomSpinner = (): string => SPINNER[Math.floor(Math.random() * SPINNER.length)];

    const getSpinner = (): string => loadStatus === LoadStatus.Loading ? getRandomSpinner() : GhostSpinner;

    return (
        <React.Fragment>
            <Dialog
                fullScreen
                hideBackdrop
                open={openDialog}
                PaperProps={{
                    style: { backgroundColor: "rgba(255,255,255,0.7)" },
                }}
                style={{
                    zIndex: loadingActivity,
                }}
            >
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    style={{ flexGrow: 1 }}
                >
                    <Grid item>
                        <img src={getSpinner()} height={80} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" align="center" gutterBottom>
                            {loadStatus === LoadStatus.Loading
                                ? "Loading the lesson material!"
                                : null}
                            {loadStatus === LoadStatus.Error
                                ? "Sorry, something went wrong!"
                                : null}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            variant="caption"
                            align="center"
                            gutterBottom
                        >
                            {loadStatus === LoadStatus.Loading
                                ? `If you still see this screen after ${seconds} seconds, click Reload below.`
                                : null}
                            {loadStatus === LoadStatus.Error
                                ? "Please click the Reload button."
                                : null}
                        </Typography>
                    </Grid>
                    <Grid item style={{ paddingTop: theme.spacing(2) }}>
                        <StyledFAB
                            disabled={loadStatus === LoadStatus.Loading}
                            onClick={() => setLoadStatus(LoadStatus.Loading)}
                        >
                            Reload{" "}
                            <RefreshIcon
                                size="1rem"
                                style={{ marginLeft: isSmDown ? 0 : 4 }}
                            />
                        </StyledFAB>
                    </Grid>
                </Grid>
            </Dialog>
            <iframe
                id="recordediframe"
                src={contentHrefWithToken}
                ref={iframeRef}
                allow="microphone"
                data-h5p-width={contentWidth}
                data-h5p-height={contentWidth}
                style={{
                    width: enableResize ? contentWidth : '100%',
                    height: enableResize ? contentHeight : height,
                    position: enableResize ? `absolute` : 'static',
                    transformOrigin: classType === ClassType.LIVE ? 'top left' : 'unset',
                    transform: enableResize ? `scale(${transformScale})` : `scale(1)`,
                }}
                onLoad={() => { setLoadStatus(LoadStatus.Finished); window.dispatchEvent(new Event(`resize`)); }}
            />
        </React.Fragment>
    );
}
