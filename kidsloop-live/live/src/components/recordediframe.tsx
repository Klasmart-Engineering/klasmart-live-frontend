import React, { useRef, useEffect, useState, useContext } from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { UserContext } from "../entry";
import IframeResizer from "iframe-resizer-react";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import { useTheme } from "@material-ui/core/styles";
import { DRAWER_WIDTH } from "./layout";
import Typography from "@material-ui/core/Typography";
import StyledFAB from "./styled/fabButton";

import CurlySpinner1 from "../assets/img/spinner/curly1_spinner.gif"
import CurlySpinner2 from "../assets/img/spinner/curly2_spinner.gif"
import EccoSpinner1 from "../assets/img/spinner/ecco1_spinner.gif"
import EccoSpinner2 from "../assets/img/spinner/ecco2_spinner.gif"
import JessSpinner1 from "../assets/img/spinner/jess1_spinner.gif"
import MimiSpinner1 from "../assets/img/spinner/mimi1_spinner.gif"
import GhostSpinner from "../assets/img/spinner/ghost_spinner.gif"

interface NewProps extends IframeResizer.IframeResizerProps{
    forwardRef: any
}

const IframeResizerNew = IframeResizer as React.FC<NewProps>

const SPINNER = [CurlySpinner1, CurlySpinner2, EccoSpinner1, EccoSpinner2, JessSpinner1, MimiSpinner1];

import { Refresh as RefreshIcon } from "@styled-icons/material/Refresh";
import useMediaQuery from "@material-ui/core/useMediaQuery";

const SET_STREAMID = gql`
    mutation setSessionStreamId($roomId: ID!, $streamId: ID!) {
        setSessionStreamId(roomId: $roomId, streamId: $streamId)
    }
`;

export interface Props {
    contentId: string;
    setStreamId: React.Dispatch<React.SetStateAction<string | undefined>>;
    parentWidth: number;
    parentHeight: number;
}

export function RecordedIframe(props: Props): JSX.Element {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const { roomId } = useContext(UserContext);
    const { contentId, setStreamId, parentWidth, parentHeight } = props;
    const [sendStreamId] = useMutation(SET_STREAMID);

    const [widthHeight, setWidthHeight] = useState<{
        width: number | string,
        height: number
    }>({ width: "100%", height: 700 });
    const [minHeight, setMinHeight] = useState<number>();
    const [numRenders, setNumRenders] = useState(0);
    const [key, setKey] = useState(Math.random());
    const [openDialog, setOpenDialog] = useState(true);
    const [seconds, setSeconds] = useState(60);
    const [spinner, setSpinner] = useState(Math.floor(Math.random() * Math.floor(SPINNER.length)));

    useEffect(() => {
        const timer = setTimeout(() => {
            let newTime = seconds - 1;
            setSeconds(newTime);
        }, 1000);

        if (seconds <= 0) { clearTimeout(timer); }
        return () => clearTimeout(timer);
    });

    const scaleToFitParent = (iframeWidth: number, iframeHeight: number) => {
        const scale = parentHeight / iframeHeight;
        if (scale < 1) {
            const width = iframeWidth * scale;
            const height = iframeHeight * scale;
            setWidthHeight({ width: width, height: height })
            setKey(Math.random());
        }
    }

    function inject(iframeElement: HTMLIFrameElement) {
        const contentWindow = iframeElement.contentWindow
        const contentDoc = iframeElement.contentDocument
        if (!contentWindow || !contentDoc) { return; }
        // IP Protection
        const blockRightClick = (e: MouseEvent) => { e.preventDefault() }
        contentWindow.addEventListener("contextmenu", (e) => blockRightClick(e), false);

        const h5pDivCollection = contentDoc.body.getElementsByClassName("h5p-content");
        // TODO: Is it possible to handle all non-h5p content with this line?
        const contentDivCollection = contentDoc.body.getElementsByClassName("content");
        if (h5pDivCollection.length > 0) {
            const h5pContainer = h5pDivCollection[0]
            h5pContainer.setAttribute("data-iframe-height", "");
        } else if (contentDivCollection.length > 0) {
            contentDivCollection[0].setAttribute("data-iframe-height", "");
        } else {
            setMinHeight(700);
        }

        const cdnResizerScript = contentDoc.createElement("script");
        cdnResizerScript.setAttribute("type", "text/javascript");
        cdnResizerScript.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.5.8/iframeResizer.contentWindow.min.js");
        contentDoc.head.appendChild(cdnResizerScript);

        const h5pResizerScript = contentDoc.createElement("script");
        h5pResizerScript.setAttribute("type", "text/javascript");
        h5pResizerScript.setAttribute("src", "https://h5p.org/sites/all/modules/h5p/library/js/h5p-resizer.js");
        contentDoc.head.appendChild(h5pResizerScript);

        return contentWindow.removeEventListener("contextmenu", (e) => blockRightClick(e), false);
    }

    useEffect(() => {
        const iRef = window.document.getElementById("recordediframe") as HTMLIFrameElement;
        if (!iRef) { return; }
        iRef.addEventListener("load", () => inject(iRef));
        return () => iRef.removeEventListener("load", () => inject(iRef));
    }, [iframeRef, key])

    useEffect(() => {
        setWidthHeight({ width: "100%", height: widthHeight.height });
        // TODO: Might be need to add scaleToFitParent() here.
    }, [contentId]);

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

    return (
        <React.Fragment>
            <Dialog
                fullScreen
                hideBackdrop
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                PaperProps={{
                    style: { backgroundColor: "rgba(255,255,255,0.6)" },
                }}
                style={{
                    marginRight: isSmDown ? "" : DRAWER_WIDTH,
                    zIndex: theme.zIndex.drawer - 1
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
                        <img src={seconds ? SPINNER[spinner] : GhostSpinner} height={80} />
                    </Grid>
                    <Grid item>
                        <Typography variant="h6" align="center" gutterBottom>
                            {seconds ?
                                "Loading the lesson material!" :
                                "Sorry, something went wrong!"
                            }
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="caption" align="center" gutterBottom>
                            {seconds ?
                                `If you still see this screen after ${seconds} seconds, click Reload below.` :
                                "Please click the Reload button."
                            }
                        </Typography>
                    </Grid>
                    <Grid item style={{ paddingTop: theme.spacing(2) }}>
                        <StyledFAB
                            disabled={seconds !== 0}
                            onClick={() => {
                                setKey(Math.random());
                                setSeconds(60);
                                setSpinner(Math.floor(Math.random() * Math.floor(SPINNER.length)));
                            }}
                        >
                            Reload <RefreshIcon size="1rem" style={{ marginLeft: isSmDown ? 0 : 4 }} />
                        </StyledFAB>
                    </Grid>
                </Grid>
            </Dialog>
            <IframeResizerNew
                // log
                id="recordediframe"
                src={contentId}
                forwardRef={iframeRef}
                heightCalculationMethod="taggedElement"
                minHeight={minHeight}
                onResized={(e) => {
                    setNumRenders(numRenders + 1);
                    startRecording();
                    const width = Number(e.width), height = Number(e.height);
                    if (numRenders < 1) {
                        scaleToFitParent(width, height)
                    }
                    setOpenDialog(false);
                }}
                style={{
                    width: widthHeight.width,
                    height: widthHeight.height
                    // As long as it is the <Whiteboard />'s children, it cannot be centered with margin: "0 auto".
                }}
                key={key}
                checkOrigin={false}
            />
        </React.Fragment>
    );
}
