import React, { useRef, useEffect, useState, useContext } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { LocalSessionContext } from "../entry";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import StyledFAB from "./styled/fabButton";
import { loadingActivity } from "../utils/layerValues";

import CurlySpinner1 from "../assets/img/spinner/curly1_spinner.gif"
import CurlySpinner2 from "../assets/img/spinner/curly2_spinner.gif"
import EccoSpinner1 from "../assets/img/spinner/ecco1_spinner.gif"
import EccoSpinner2 from "../assets/img/spinner/ecco2_spinner.gif"
import JessSpinner1 from "../assets/img/spinner/jess1_spinner.gif"
import MimiSpinner1 from "../assets/img/spinner/mimi1_spinner.gif"
import GhostSpinner from "../assets/img/spinner/ghost_spinner.gif"
import { Refresh as RefreshIcon } from "@styled-icons/material/Refresh";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useWindowSize } from "../utils/viewport";
import { useSelector } from "react-redux";
import { State } from "../store/store";

const SET_STREAMID = gql`
    mutation setSessionStreamId($roomId: ID!, $streamId: ID!) {
        setSessionStreamId(roomId: $roomId, streamId: $streamId)
    }
`;

export interface Props {
    contentId: string;
    setStreamId: React.Dispatch<React.SetStateAction<string | undefined>>;
    square?: number;
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

    const { roomId } = useContext(LocalSessionContext);
    const drawerOpen = useSelector((state: State) => state.control.drawerOpen);
    const { contentId, setStreamId, square } = props;
    const [sendStreamId] = useMutation(SET_STREAMID);

    const [transformScale, setTransformScale] = useState<number>(1);
    const [openDialog, setOpenDialog] = useState(true);
    const [seconds, setSeconds] = useState(MAX_LOADING_COUNT);
    const [loadStatus, setLoadStatus] = useState(LoadStatus.Loading);
    const [intervalId, setIntervalId] = useState<number>();
    const [contentWidth, setContentWidth] = useState(1600);
    const [contentHeight, setContentHeight] = useState(1400);
    const size = useWindowSize();

    useEffect(() => {
        scale(contentWidth, contentHeight);
    }, [size])

    useEffect(() => {
        // TODO gotta find a way to resize the h5p activity when the drawer gets opened.
        // window.dispatchEvent(new Event('resize'));
    }, [drawerOpen])

    useEffect(() => {
        setSeconds(MAX_LOADING_COUNT)
        setLoadStatus(LoadStatus.Loading)

        const iRef = window.document.getElementById("recordediframe") as HTMLIFrameElement;
        iRef.addEventListener("load", () => setLoadStatus(LoadStatus.Finished));
        return () => iRef.removeEventListener("load", () => setLoadStatus(LoadStatus.Finished));
    }, [contentId]);

    useEffect(() => {
        if (loadStatus === LoadStatus.Loading) {
            const interval = window.setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
            setIntervalId(interval)
        } else if (loadStatus === LoadStatus.Finished) {
            setOpenDialog(false);
            clearInterval(intervalId);
            onLoad()
            startRecording()
        } else if (seconds <= 0 || loadStatus === LoadStatus.Error) {
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    }, [loadStatus]);

    const scale = (innerWidth: number, innerHeight: number) => {
        let currentWidth: number = size.width, currentHeight: number = size.height;

        if (square) {
            /**
             * For exact synchronization of <Whiteboard /> drawing position,
             * Square should be required when classtype === Classtype.LIVE.
             */
            currentWidth = square, currentHeight = square;
        } else {
            const iRef = window.document.getElementById("main-container") as HTMLIFrameElement;
            if (iRef) {
                currentWidth = iRef.getBoundingClientRect().width;
                currentHeight = iRef.getBoundingClientRect().height;
            }
        }

        const shrinkRatioX = (currentWidth / innerWidth) > 1 ? 1 : currentWidth / innerWidth;
        const shrinkRatioY = (currentHeight / innerHeight) > 1 ? 1 : currentHeight / innerHeight;
        const shrinkRatio = Math.min(shrinkRatioX, shrinkRatioY);
        setTransformScale(shrinkRatio);
    }

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
        if (h5pDivCollection.length > 0) {
            const h5pContainer = h5pDivCollection[0] as HTMLDivElement;
            h5pContainer.setAttribute("data-iframe-height", "");
            const h5pWidth = h5pContainer.getBoundingClientRect().width;
            const h5pHeight = h5pContainer.getBoundingClientRect().height;
            setContentWidth(h5pWidth);
            setContentHeight(h5pHeight);
            scale(h5pWidth, h5pHeight);
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
        const iRef = window.document.getElementById("recordediframe") as HTMLIFrameElement;
        if (!iRef ||
            !iRef.contentWindow ||
            (iRef.contentWindow as any).kidslooplive ||
            !iRef.contentDocument) { return; }
        const doc = iRef.contentDocument;
        const script = doc.createElement("script");
        script.setAttribute("type", "text/javascript");
        const matches = window.location.pathname.match(/^(.*\/+)([^/]*)$/);
        const prefix = matches && matches.length >= 2 ? matches[1] : "";
        script.setAttribute("src", `${prefix}record.js`);
        doc.head.appendChild(script);
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
                src={contentId}
                ref={iframeRef}
                style={{
                    width: contentWidth,
                    height: contentHeight,
                    position: `absolute`,
                    top: 0,
                    left: 0,
                    transformOrigin: "top left",
                    transform: `scale(${transformScale})`,
                }}
            />
        </React.Fragment>
    );
}
