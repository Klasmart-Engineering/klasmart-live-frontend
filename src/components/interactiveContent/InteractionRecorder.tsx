import { useServices } from "@/app/context-provider/services-provider";
import { useCustomFlashCard } from "@/app/utils/customFlashCard";
import { injectIframeScript } from "@/app/utils/injectIframeScript";
import useScrollCanvasWithContent from "@/components/interactiveContent/useScrollCanvasWithContent";
import {
    CANVAS_RESOLUTION_MAX,
    SCROLLBAR_BACKGROUND,
    SCROLLBAR_SIZE,
    THEME_COLOR_SECONDARY_DEFAULT,
} from "@/config";
import { useSetStreamIdMutation } from "@/data/live/mutations/useSetStreamIdMutation";
import { useSessions } from "@/data/live/state/useSessions";
import {
    useHttpEndpoint,
    useRegionSelect,
} from "@/providers/region-select-context";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    classActiveUserIdState,
    streamIdState,
} from "@/store/layoutAtoms";
import { BaseWhiteboard } from "@/whiteboard/components/BaseWhiteboard";
import WhiteboardBorder from "@/whiteboard/components/Border";
import { useToolbarContext } from "@kl-engineering/kidsloop-canvas/dist/components/toolbar/toolbar-context-provider";
import {
    Button,
    CircularProgress,
    createStyles,
    Dialog,
    Grid,
    makeStyles,
    Typography,
    useMediaQuery,
    useTheme,
} from "@material-ui/core";
import { Refresh as RefreshIcon } from "@styled-icons/material/Refresh";
import React,
{
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useResizeDetector } from "react-resize-detector";
import {
    useRecoilValue,
    useSetRecoilState,
} from "recoil";

const useStyles = makeStyles((theme) => createStyles({
    activityContainer: {
        width: `100%`,
        height: `100%`,
        display: `flex`,
        alignItems: `center`,
        justifyContent: `center`,
    },
    activity: {
        width: `100%`,
        height: `100%`,
        position: `absolute`,
        background: theme.palette.common.white,
    },
}));

export interface Props {
    contentHref: string;
    group?: string;
    filterGroups?: string[];
}

export enum LoadStatus {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Error,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Loading,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    Finished,
}

export default function InteractionRecorder (props: Props): JSX.Element {
    const {
        contentHref,
        group,
        filterGroups,
    } = props;
    const MAX_LOADING_COUNT = 60;
    const classes = useStyles();
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down(`sm`));

    const {
        roomId,
        classType,
        token,
    } = useSessionContext();
    const sessions = useSessions();
    const setStreamId = useSetRecoilState(streamIdState);
    const classActiveUserId = useRecoilValue(classActiveUserIdState);

    const imageExtensionPattern = /\.(jpe?g|png|gif|bmp)$/gi;
    const isImageContent = !!contentHref?.match(imageExtensionPattern);
    const isPdfContent = contentHref.endsWith(`.pdf`);

    const [ sendStreamId ] = useSetStreamIdMutation();

    const [ openDialog, setOpenDialog ] = useState(true);
    const [ seconds, setSeconds ] = useState(MAX_LOADING_COUNT);
    const [ loadStatus, setLoadStatus ] = useState(LoadStatus.Loading);
    const [ userCount, setUserCount ] = useState(sessions.size);
    const [ initialActivityArea, setInitialActivityArea ] = useState({
        width: 0,
        height: 0,
    });
    const [ iframeReady, setIframeReady ] = useState(false);

    /*
    Each time this is changed, it means that the onLoad function
    of the iframe was called.
    */
    const [ iframeLoaded, setIframeLoaded ] = useState(0);
    const interval = useRef<ReturnType<typeof setInterval>>();

    const { authenticationService } = useServices();
    const { region } = useRegionSelect();

    const recorderEndpoint = useHttpEndpoint(`live`);
    const authEndpoint = useHttpEndpoint(`auth`);

    const iframeRef = useRef<HTMLIFrameElement>(null);
    const iframeElement = iframeRef.current;
    const contentWindow = iframeElement?.contentWindow;
    const contentDoc = iframeElement?.contentDocument;
    const contentWindowDocument = iframeElement?.contentWindow?.document;

    const urlParameterClassActiveUser = classActiveUserId ? `&userId=${classActiveUserId}` : ``;

    //Fetch the canvas toolbar context
    const {
        state: { tools },
        actions: { panCanvas },
    } = useToolbarContext();
    const {
        width: activityWidth = 0,
        height: activityHeight = 0,
        ref: activityAreaRef,
    } = useResizeDetector();

    useEffect(() => {
        if (!activityWidth || !activityHeight || initialActivityArea.width || initialActivityArea.height) return;
        setInitialActivityArea({
            width: activityWidth,
            height: activityHeight,
        });
    }, [
        activityWidth,
        activityHeight,
        initialActivityArea.height,
        initialActivityArea.width,
    ]);

    const activityAreaScale = useMemo(() => {
        if (!activityWidth || !activityHeight || !initialActivityArea.width || !initialActivityArea.height) return 1;
        return Math.min(activityWidth / initialActivityArea.width, activityHeight / initialActivityArea.height);
    }, [
        activityWidth,
        activityHeight,
        initialActivityArea.height,
        initialActivityArea.width,
    ]);

    const getPDFURLTransformer = (contentHref: string, token: string | undefined, recorderEndpoint: string, encodedEndpoint: string, encodedAuthEndpoint: string) => {
        const pdfEndpoint = !process.env.IS_CORDOVA_BUILD ? `${process.env.ENDPOINT_PDF}/pdf` : region?.services.pdf ?? ``;
        const pdfPath = contentHref.replace(`${recorderEndpoint}`, ``);
        const jpegTransformer = `pdfviewer.html?pdf=${pdfPath}&token=${token}&endpoint=${encodedEndpoint}&auth=${encodedAuthEndpoint}&pdfendpoint=${pdfEndpoint}`;
        const svgTransformer = `${contentHref.replace(`${recorderEndpoint}/assets`, `pdfviewer.html?pdfSrc=/assets`)}&token=${token}&endpoint=${encodedEndpoint}&auth=${encodedAuthEndpoint}&pdfendpoint=${pdfEndpoint}`;
        switch (process.env.PDF_VERSION) {
        case `JPEG`: return jpegTransformer;
        case `SVG`: return svgTransformer;
        default: return svgTransformer;
        }
    };

    const contentHrefWithToken = useMemo<string>(() => {
        const encodedEndpoint = encodeURIComponent(recorderEndpoint);
        const encodedAuthEndpoint = encodeURIComponent(authEndpoint);
        if (contentHref.endsWith(`.pdf`)) {
            return getPDFURLTransformer(contentHref, token, recorderEndpoint, encodedEndpoint, encodedAuthEndpoint);
        }
        const queryParams = `?token=${token}&endpoint=${encodedEndpoint}&auth=${encodedAuthEndpoint}${urlParameterClassActiveUser}`;

        //Temporary fix for Vietnam environment, the cdn url doesn't work in iframe due to CORS Origin issue.
        //https://calmisland.atlassian.net/wiki/spaces/KLVN/pages/2654699547/Material+URLs+in+Live+class
        if(region?.services.cdn && contentHref.startsWith(region.services.cdn)) {
            return `${recorderEndpoint}${contentHref.replace(region.services.cdn, ``)}${queryParams}`;
        }
        return `${contentHref}${queryParams}`;
    }, [
        contentHref,
        token,
        recorderEndpoint,
        authEndpoint,
        region,
    ]);

    useCustomFlashCard({
        iframeID: `recordediframe`,
        loadStatus: loadStatus,
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

    const sendIframeClassActiveUser = (userId?: string) => {
        if (classType !== ClassType.CLASSES && !userId) return;

        iframeRef?.current?.contentWindow?.postMessage({
            type: `CLASS_ACTIVE_USER`,
            user: userId,
        }, `*`);
    };

    useEffect(() => {
        sendIframeClassActiveUser(classActiveUserId);
    }, [ classActiveUserId ]);

    useEffect(() => {
        setIframeReady(false);
        setLoadStatus(LoadStatus.Loading);
        setSeconds(MAX_LOADING_COUNT);
        setOpenDialog(true);
        interval.current = setInterval(() => {
            setSeconds(seconds => seconds - 1);
        }, 1000);

        return () => clearInterval(interval.current as ReturnType<typeof setInterval>);
    }, [ contentHrefWithToken ]);

    useScrollCanvasWithContent(iframeRef, isPdfContent, isImageContent, iframeLoaded, panCanvas);
    function onLoad () {
        if (!contentWindow || !contentDoc) { return; }

        if(!contentDoc.head && contentDoc.documentElement){
            const head = document.createElement(`head`);
            contentDoc.documentElement.prepend(head);
        }

        // Remove styles if exists
        document.getElementById(`kidsloop-live-frontend-styles`)
            ?.remove();
        document.getElementById(`kidsloop-live-frontend-image-styles`)
            ?.remove();
        document.getElementById(`kidsloop-live-frontend-scrollbar`)
            ?.remove();

        // Custom styles when needed (general)
        const style = document.createElement(`style`);
        style.setAttribute(`id`, `kidsloop-live-frontend-styles`);
        style.innerHTML = `
            img { max-width: 100%; height: auto; object-fit:contain }
            img.pdfImage { max-width: none; }
            body > video { width: 100%; height: 100vh }
            .h5p-single-choice-set { max-height: 300px !important; }
            .h5p-alternative-inner{ height: auto !important; }
            .h5p-column .h5p-dragquestion > .h5p-question-content > .h5p-inner{ width: 100% !important }
            ::-webkit-media-controls { display: flex; justify-content: center; align-items: center; }
            ::-webkit-media-controls-enclosure {max-width: 400px }
        `;
        contentDoc.head.appendChild(style);

        if (isImageContent) {
            const imageStyle = document.createElement(`style`);
            imageStyle.setAttribute(`id`, `kidsloop-live-frontend-image-styles`);
            imageStyle.innerHTML = `img { pointer-events: none }`;
            contentDoc.head.appendChild(imageStyle);
        }

        // Scrollbar styles
        // 1. Remove Scrollbar cross-browsers for Live class activities H5P/PDF/.. RRWEB don't replay the scrollbar so content is shifted (KLL-1935)
        // 2. Stylize Scrollbar for Study and Class
        const scrollbarStyle = document.createElement(`style`);
        scrollbarStyle.setAttribute(`id`, `kidsloop-live-frontend-scrollbar`);

        scrollbarStyle.innerHTML = `
        body { scrollbar-width: none; -ms-overflow-style: none; }
        body::-webkit-scrollbar { width: 0; height: 0 }
            .h5p-content {max-height: 100vh; overflow: auto; }
            .indiana-scroll-container::-webkit-scrollbar,
            .h5p-content::-webkit-scrollbar { width: ${SCROLLBAR_SIZE}px; height: ${SCROLLBAR_SIZE}px; } 
            .indiana-scroll-container::-webkit-scrollbar-thumb,
            .h5p-content::-webkit-scrollbar-thumb { background-color: ${THEME_COLOR_SECONDARY_DEFAULT}; border-radius: 10px;  }
            .indiana-scroll-container::-webkit-scrollbar-track { background-color: transparent }
            .h5p-content::-webkit-scrollbar-track { background-color: ${SCROLLBAR_BACKGROUND}  }
            `;

        contentDoc.head.appendChild(scrollbarStyle);

        // IP Protection: Contents should not be able to be downloaded by right-clicking.
        const blockRightClick = (e: MouseEvent) => { e.preventDefault(); };
        contentWindow.addEventListener(`contextmenu`, (e) => blockRightClick(e), false);

        if (!isPdfContent) {
            if (process.env.IS_CORDOVA_BUILD) {
                injectIframeScript(iframeElement, `h5presize`);
            } else {
                const iframeScript = document.createElement(`script`);
                iframeScript.setAttribute(`id`, `kidsloop-live-frontend-script-inject`);

                iframeScript.innerHTML = `
                    const triggerH5pResize = () => {
                        if (!H5P) {
                            console.error('H5P not available on this page.');
                            return;
                        }
                        console.log('[H5P] Trigger resize');
                        H5P.trigger(H5P.instances[0], 'resize');
                    }
                    window.addEventListener('iframe-browser-resize', triggerH5pResize, false);
                `;
                contentDoc.head.appendChild(iframeScript);
            }
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
                const iRef = iframeRef.current;
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
                const iRef = iframeRef.current;
                if (!iRef ||
                    !iRef.contentWindow ||
                    (iRef.contentWindow as any).kidslooplive ||
                    !iRef.contentDocument) { return; }
                const doc = iRef.contentDocument;
                const script = doc.createElement(`script`);
                script.setAttribute(`type`, `text/javascript`);
                const matches = window.location.pathname.match(/^(.*\/+)([^/]*)$/);
                const prefix = matches && matches.length >= 2 ? matches[1] : ``;
                script.setAttribute(`src`, `${prefix}record.${process.env.GIT_COMMIT}.js`);
                doc.head.appendChild(script);
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    function onLoadIframe () {
        console.log(`iframe ready - injecting scripts`);
        sendIframeClassActiveUser(classActiveUserId);
        onLoad();
        if (classType !== ClassType.STUDY) {
            startRecording();
        }
        setLoadStatus(LoadStatus.Finished);
        clearInterval(interval.current as ReturnType<typeof setInterval>);
        setOpenDialog(false);
    }

    useEffect(() => {
        const documentRef = contentDoc || contentWindowDocument;
        if(!documentRef) return;
        const timer = setInterval(function () {
            if (documentRef.readyState === `complete`) {
                clearInterval(timer);
                setIframeReady(true);
            }
        }, 1000);
    }, [ contentHrefWithToken ]);

    useEffect(() => {
        if(!iframeReady) return;
        onLoadIframe();
    }, [ iframeReady ]);

    return (
        <>
            <div
                ref={activityAreaRef}
                className={classes.activityContainer}
            >
                <div
                    style={{
                        transform: `scale(${activityAreaScale})`,
                        width: initialActivityArea.width,
                        height: initialActivityArea.height,
                        transformOrigin: `center`,
                        position: `absolute`,
                    }}
                >
                    <iframe
                        key={contentHref}
                        ref={iframeRef}
                        id="recordediframe"
                        src={contentHrefWithToken}
                        allow="microphone"
                        className={classes.activity}
                        onLoad={() => {
                            /* Added this here because calling it from
                            the onLoadIframe function did not have the same effect
                            for subsequent content loads.The inner document
                            was not accessible in the hook.
                            */
                            setIframeLoaded(Date.now());
                        }}
                        onError={() => {
                            setLoadStatus(LoadStatus.Error);
                            clearInterval(interval.current as ReturnType<typeof setInterval>);
                        }}
                    />
                    <BaseWhiteboard
                        group={group}
                        filterGroups={filterGroups}
                        width={initialActivityArea.width * (CANVAS_RESOLUTION_MAX / initialActivityArea.width)}
                        height={initialActivityArea.height * (CANVAS_RESOLUTION_MAX / initialActivityArea.width)}
                    />
                </div>
                <WhiteboardBorder
                    width={initialActivityArea.width * activityAreaScale}
                    height={initialActivityArea.height * activityAreaScale}
                />
            </div>
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
                            align="center"
                        >
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
                            {loadStatus === LoadStatus.Loading && (
                                <FormattedMessage
                                    id="loading_activity_lessonMaterial_description"
                                    values={{
                                        seconds: seconds,
                                    }}
                                />
                            )}
                            {loadStatus === LoadStatus.Error && <FormattedMessage id="loading_activity_lessonMaterial_clickReload" />}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        style={{
                            paddingTop: theme.spacing(2),
                        }}
                    >
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
        </>
    );
}
