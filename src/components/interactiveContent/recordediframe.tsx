import { useServices } from "@/app/context-provider/services-provider";
import { useCustomFlashCard } from "@/app/utils/customFlashCard";
import { injectIframeScript } from "@/app/utils/injectIframeScript";
import { useSetStreamIdMutation } from "@/data/live/mutations/useSetStreamIdMutation";
import { useSessions } from "@/data/live/state/useSessions";
import { useHttpEndpoint } from "@/providers/region-select-context";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    isLessonPlanOpenState,
    streamIdState,
} from "@/store/layoutAtoms";
import { useWindowSize } from "@/utils/viewport";
import { Button } from "@material-ui/core";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { Refresh as RefreshIcon } from "@styled-icons/material/Refresh";
import React,
{
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

export interface Props {
    contentHref: string;
}

export enum LoadStatus {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Error,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Loading,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Finished,
}

export function RecordedIframe (props: Props): JSX.Element {
    const MAX_LOADING_COUNT = 60;
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const {
        roomId,
        classType,
        token,
    } = useSessionContext();
    const sessions = useSessions();
    const [ , setStreamId ] = useRecoilState(streamIdState);
    const [ isLessonPlanOpen ] = useRecoilState(isLessonPlanOpenState);

    const { contentHref } = props;

    const imageExtensionPattern = /\.(jpe?g|png|gif|bmp)$/gi;
    const isImageContent = contentHref?.match(imageExtensionPattern);
    const isPdfContent = contentHref.endsWith(`.pdf`);

    const [ sendStreamId ] = useSetStreamIdMutation();

    const [ openDialog, setOpenDialog ] = useState(true);
    const [ seconds, setSeconds ] = useState(MAX_LOADING_COUNT);
    const [ loadStatus, setLoadStatus ] = useState(LoadStatus.Loading);
    const [ intervalId, setIntervalId ] = useState<number>();
    const [ userCount, setUserCount ] = useState(sessions.size);

    const [ useDoubleSize, setUseDoubleSize ] = useState(false);

    const size = useWindowSize();

    const { authenticationService } = useServices();

    const recorderEndpoint = useHttpEndpoint(`live`);

    const getPDFURLTransformer = (contentHref: string, token: string | undefined, recorderEndpoint: string, encodedEndpoint: string) => {
        const jpegTransformer = `${contentHref.replace(`/assets/`, `/pdf/`)}/view.html?token=${token}&endpoint=${encodedEndpoint}`;
        const svgTransformer = `${contentHref.replace(`${recorderEndpoint}/assets`, `pdfviewer.html?pdfSrc=/assets`)}&token=${token}&endpoint=${encodedEndpoint}`;
        switch (process.env.PDF_VERSION) {
        case `JPEG`: return jpegTransformer;
        case `SVG`: return svgTransformer;
        default: return svgTransformer;
        }
    };

    const contentHrefWithToken = useMemo<string>(() => {
        const encodedEndpoint = encodeURIComponent(recorderEndpoint);
        if (contentHref.endsWith(`.pdf`)) {
            return getPDFURLTransformer(contentHref, token, recorderEndpoint, encodedEndpoint);
        } else {
            return `${contentHref}?token=${token}&endpoint=${encodedEndpoint}`;
        }
    }, [
        contentHref,
        token,
        recorderEndpoint,
    ]);

    useCustomFlashCard({
        iframeID: `recordediframe`,
        loadStatus:  loadStatus,
        openLoadingDialog: openDialog,
        setOpenLoadingDialog: setOpenDialog,
    });

    useEffect(() => {
        if (sessions.size > userCount && iframeRef && iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: `USER_JOIN`,
            }, `*`);
        }
        setUserCount(sessions.size);
    }, [ sessions ]);

    useEffect(() => {
        if (classType == ClassType.LIVE) {
            setTimeout(function () {
                scaleWhiteboard();
            }, 300);
        }
    }, [ size ]);

    useEffect(() => {
        setTimeout(function () {
            window.dispatchEvent(new Event(`resize`));
        }, 300);
    }, [ isLessonPlanOpen ]);

    useEffect(() => {
        setSeconds(MAX_LOADING_COUNT);
        setLoadStatus(LoadStatus.Loading);
    }, [ contentHrefWithToken ]);

    useEffect(() => {
        if (loadStatus === LoadStatus.Loading) {
            setOpenDialog(true);
            const interval = window.setInterval(() => {
                setSeconds(seconds => seconds - 1);
            }, 1000);
            setIntervalId(interval);
        } else if (loadStatus === LoadStatus.Finished) {
            setTimeout(function () {
                setOpenDialog(false);
                clearInterval(intervalId);
                onLoad();
                startRecording();
            }, 500);
        } else if (seconds <= 0 || loadStatus === LoadStatus.Error) {
            clearInterval(intervalId);
        }
        return () => clearInterval(intervalId);
    }, [ loadStatus ]);

    // TODO : Find a better system to scale the Whiteboard to the h5p
    const scaleWhiteboard = () => {
        const recordediframe = window.document.getElementById(`recordediframe`) as HTMLIFrameElement;
        const recordediframeStyles = recordediframe.getAttribute(`style`);
        const whiteboard = window.document.getElementsByClassName(`canvas-container`)[0];
        if (recordediframeStyles) {
            whiteboard.setAttribute(`style`, recordediframeStyles);
        }
    };

    function onLoad () {
        // TODO the client-side rendering version of H5P is ready! we can probably delete this function and the scale function above
        // if we switch over to it! Ask me (Daiki) about the details.
        const iframeElement = window.document.getElementById(`recordediframe`) as HTMLIFrameElement;
        const contentWindow = iframeElement.contentWindow;
        const contentDoc = iframeElement.contentDocument;

        if (!contentWindow || !contentDoc) { return; }

        // Remove styles if exists
        document.getElementById(`kidsloop-live-frontend-styles`)?.remove();
        document.getElementById(`kidsloop-live-frontend-image-styles`)?.remove();

        // Custom styles when needed (general)
        const style = document.createElement(`style`);
        style.setAttribute(`id`, `kidsloop-live-frontend-styles`);
        style.innerHTML = `
        img { max-width: 100%; height: auto; object-fit:contain }
        body { overflow-y: overlay; } // Makes the Scrollbar in absolute position and won't impact the size (KLL-1935), fallback to auto for unsupported browsers
        body > video { width: 100%; height: 100vh }
        .h5p-single-choice-set { max-height: 300px !important; }
        .h5p-alternative-inner{ height: auto !important; }
        .h5p-column .h5p-dragquestion > .h5p-question-content > .h5p-inner{ width: 100% !important }
        ::-webkit-scrollbar { -webkit-appearance: none; }
        ::-webkit-scrollbar:vertical { width: 14px; }
        ::-webkit-scrollbar:horizontal { height: 14px; }
        ::-webkit-scrollbar-thumb { background-color: #619bd8; border-radius: 10px;  }
        ::-webkit-scrollbar-track { border-radius: 10px; }
        `;
        contentDoc.head.appendChild(style);

        if(isImageContent){
            const imageStyle = document.createElement(`style`);
            imageStyle.setAttribute(`id`, `kidsloop-live-frontend-image-styles`);
            imageStyle.innerHTML = `img { pointer-events: none }`;
            contentDoc.head.appendChild(imageStyle);
        }

        // IP Protection: Contents should not be able to be downloaded by right-clicking.
        const blockRightClick = (e: MouseEvent) => { e.preventDefault(); };
        contentWindow.addEventListener(`contextmenu`, (e) => blockRightClick(e), false);
        const h5pTypeColumn = contentDoc.body.getElementsByClassName(`h5p-column`).length;

        setUseDoubleSize(!isPdfContent && h5pTypeColumn > 0);

        if (!isPdfContent) {
            injectIframeScript(iframeElement, `h5presize`);
        }
    }

    useEffect(() => {
        function onMessage ({ data }: MessageEvent) {
            if (!data) { return; }
            if (data.streamId) {
                setStreamId?.(data.streamId);
                sendStreamId({
                    variables: {
                        roomId,
                        streamId: data.streamId,
                    },
                });
            }
            switch (data.error) {
            case `RedirectToLogin`:
                authenticationService?.signout();
                break;
            }
        }

        window.addEventListener(`message`, onMessage);
        return () => {
            window.removeEventListener(`message`, onMessage);
            setStreamId(``);
        };
    }, [ iframeRef.current ]);

    function startRecording () {
        if (process.env.IS_CORDOVA_BUILD) {
            try {
                const iRef = window.document.getElementById(`recordediframe`) as HTMLIFrameElement;
                if (!iRef ||
                    !iRef.contentWindow ||
                    (iRef.contentWindow as any).kidslooplive ||
                    !iRef.contentDocument) { return; }

                injectIframeScript(iRef, `record`);
            } catch (error) {
                console.error(error);
            }
        } else {
            try {
                const iRef = window.document.getElementById(`recordediframe`) as HTMLIFrameElement;
                if (!iRef ||
                    !iRef.contentWindow ||
                    (iRef.contentWindow as any).kidslooplive ||
                    !iRef.contentDocument) { return; }
                const doc = iRef.contentDocument;
                const script = doc.createElement(`script`);
                script.setAttribute(`type`, `text/javascript`);
                const matches = window.location.pathname.match(/^(.*\/+)([^/]*)$/);
                const prefix = matches && matches.length >= 2 ? matches[1] : ``;
                script.setAttribute(`src`, `${prefix}record-3f6f2667.js`);
                doc.head.appendChild(script);
            }
            catch (e) {
                console.log(e);
            }
        }

    }

    return (
        <React.Fragment>
            <Dialog
                fullScreen
                hideBackdrop
                open={openDialog}
                PaperProps={{
                    style: {
                        backgroundColor: `rgba(255,255,255,0.7)`,
                    },
                }}
                style={{
                    zIndex: 1300,
                }}
            >
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center"
                    style={{
                        flexGrow: 1,
                    }}
                >
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                    <Grid item>
                        <Typography
                            gutterBottom
                            variant="h6"
                            align="center">
                            {loadStatus === LoadStatus.Loading && <FormattedMessage id="loading_activity_lessonMaterial" />}
                            {loadStatus === LoadStatus.Error && <FormattedMessage id="loading_activity_error" />}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography
                            gutterBottom
                            variant="caption"
                            align="center"
                        >
                            {loadStatus === LoadStatus.Loading && <FormattedMessage
                                id="loading_activity_lessonMaterial_description"
                                values={{
                                    seconds: seconds,
                                }} />}
                            {loadStatus === LoadStatus.Error && <FormattedMessage id="loading_activity_lessonMaterial_clickReload" />}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        style={{
                            paddingTop: theme.spacing(2),
                        }}>
                        <Button
                            disabled={loadStatus === LoadStatus.Loading}
                            onClick={() => setLoadStatus(LoadStatus.Loading)}
                        >
                            <FormattedMessage id="loading_activity_lessonMaterial_reload" />{` `}
                            <RefreshIcon
                                size="1rem"
                                style={{
                                    marginLeft: isSmDown ? 0 : 4,
                                }}
                            />
                        </Button>
                    </Grid>
                </Grid>
            </Dialog>

            <iframe
                key={contentHref}
                ref={iframeRef}
                id="recordediframe"
                src={contentHrefWithToken}
                allow="microphone"
                style={{
                    width: (useDoubleSize ? `82%` : `100%`),
                    height: (useDoubleSize ? `82%` : `100%`),
                    transformOrigin: `top left`,
                    transform: (useDoubleSize ? `scale(1.2)` : `scale(1)`),
                }}
                onLoad={() => { setLoadStatus(LoadStatus.Finished); window.dispatchEvent(new Event(`resize`)); }}
            />
        </React.Fragment>
    );
}
