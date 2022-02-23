import ReactPlayer from "@/components/react-player/lazy";
import { useSendVideoMessageMutation } from "@/data/live/mutations/useSendVideoMessageMutation";
import { useVideoSubscription } from "@/data/live/subscriptions/useVideoSubscription";
import { useSessionContext } from "@/providers/session-context";
import { MaterialTypename } from '@/types/lessonMaterial';
import { WhiteboardLoadableElement } from "@/whiteboard/components/ContainedWhiteboard";
import {
    Box,
    CircularProgress,
    IconButton,
    makeStyles,
    useTheme,
} from "@material-ui/core";
import { VolumeMute as AudioOffIcon } from "@styled-icons/boxicons-regular/VolumeMute";
import React,
{
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import { isSafari } from "react-device-detect";

export interface VideoSynchronize {
    src?: string;
    play?: boolean;
    offset?: number;
}

interface ReplicaVideoProps extends Omit<React.VideoHTMLAttributes<HTMLMediaElement>, "onLoad">, WhiteboardLoadableElement {
    sessionId: string;
    type: 'Audio' | 'Video';
}

const PLAYLIST_FILE_NAME = `master`;
const PLAYLIST_FILE_HOST = `/video`;

const useStyles = makeStyles(() => ({
    audio: {
        width: `100%`,
        minWidth: 200,
        maxWidth: 600,
        display: `block`,
        margin: `0 auto`,
    },
    audioOverlay: {
        position: `absolute`,
        width: `100%`,
        height: `100%`,
    },
    video: {
        "& video":{
            display: `block`,
            width: `initial`,
        },
    },
}));

const createHlsDashUrlFromSrc = (src: string): string[] => {
    let urls: string[] = [];
    try {
        const pathName = new URL(src).pathname;
        const mp4exp = /(?=\w+\.\w{3}$).+/;

        const matches = mp4exp.exec(pathName);

        if (!matches || matches.length === 0) return [];

        // NOTE: Remove any files not ending wth .mp4, then remove the .mp4 extension.
        const files = matches
            .filter((s) => s.endsWith(`.mp4`))
            .map((s) => s.slice(0, -4));

        // NOTE: Create urls for HLS playlist files.
        urls = files.map((s) => `${PLAYLIST_FILE_HOST}/${s}/${PLAYLIST_FILE_NAME}.m3u8`);

        // NOTE: Create urls for DASH Playlist files.
        urls = urls.concat(files.map((s) => `${PLAYLIST_FILE_HOST}/${s}/${PLAYLIST_FILE_NAME}.mpd`));
    } catch {
        return [];
    }

    return urls;
};

// Generate multiple playable links (Not sure of it current usage so disabled it to fix KLL-1899)
const enableMultiVideoSources = false;

const handleVideoSources = (src:string, setVideoSources:React.Dispatch<React.SetStateAction<string | string[] | undefined>>) => {
    if(enableMultiVideoSources){
        const sources = createHlsDashUrlFromSrc(src);
        sources.push(src);
        const playable = sources.filter((s) => ReactPlayer.canPlay(s));
        if (playable.length > 0) {
            setVideoSources(playable[0]);
        }
    }else{
        setVideoSources(src);
    }
};

export function ReplicaMedia (props: ReplicaVideoProps) {
    const {
        sessionId,
        type,
        onLoad,
        ...mediaProps
    } = props;
    const classes = useStyles();
    const theme = useTheme();
    const srcRef = useRef<string>();
    const [ playing, setPlaying ] = useState<boolean>(false);
    const timeRef = useRef<number>();

    const [ muted, setMuted ] = useState<boolean>(isSafari);

    const { roomId } = useSessionContext();

    const ref = useRef<HTMLMediaElement>(null);
    const reactPlayerRef = useRef<ReactPlayer>(null);

    const [ videoSources, setVideoSources ] = useState<string | string[] | undefined>(undefined);
    const [ videoReady, setVideoReady ] = useState<boolean>(false);

    const reactPlayerError = useCallback(() => {
        // NOTE: Fallback to original src if there's an error.
        if (srcRef.current && videoSources !== srcRef.current) {
            setVideoSources(srcRef.current);
        }
    }, [
        srcRef.current,
        videoSources,
        setVideoSources,
    ]);

    const { loading, error } = useVideoSubscription({
        onSubscriptionData: ({ subscriptionData }) => {
            if (!subscriptionData) {
                return;
            }
            if (!subscriptionData.data) {
                return;
            }
            if (!subscriptionData.data.video) {
                return;
            }

            const {
                src,
                play,
                offset,

            } = subscriptionData.data.video;

            if (src && srcRef.current !== src) {
                setPlaying(false);
                setVideoReady(false);

                // TODO: If we could have one <video> element which is reused for all videos this
                // setMuted wouldn't be necessary. The user would only have to interact with video
                // once before it can be played.
                setMuted(isSafari);
            }

            if (src) {
                srcRef.current = src;

                if (type !== MaterialTypename.AUDIO) {
                    handleVideoSources(src, setVideoSources);
                } else {
                    setVideoSources(undefined);
                }
            }

            if (play !== undefined) setPlaying(play);
            if (offset !== undefined) {
                timeRef.current = offset;
            }

            if (ref.current) {
                if (src) {
                    ref.current.src = src;
                }
                if (offset !== undefined) {
                    ref.current.currentTime = offset;
                }
                if (play === true) {
                    ref.current.play().catch((e) => { console.error(e); });
                }
                if (play === false) {
                    ref.current.pause();
                }
            }

            if (reactPlayerRef.current && videoReady) {
                if (offset !== undefined) {
                    reactPlayerRef.current.seekTo(offset, `seconds`);
                }
            }
        },
        variables: {
            roomId,
            sessionId,
        },
    });

    useEffect(() => {
        if (!ref.current) {
            return;
        }
        const video = ref.current;
        if (srcRef.current !== undefined) {
            video.src = srcRef.current;
        }
        if (timeRef.current !== undefined && Number.isFinite(timeRef.current)) {
            video.currentTime = timeRef.current;
        }
        if (playing === true) {
            video.play().catch((e) => { console.error(e); });
        }
        if (playing === false) {
            video.pause();
        }
    }, [ ref.current ]);

    if (loading) {
        return <CircularProgress />;
    }
    if (error) {
        console.log(error);
        return <CircularProgress />;
    }
    switch (type) {
    case MaterialTypename.AUDIO:
        return (
            <Box
                position="relative"
                height="100%"
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center">
                <audio
                    ref={ref}
                    controls
                    playsInline
                    className={classes.audio}
                    src={srcRef.current}
                    crossOrigin="anonymous"
                    controlsList="nodownload"
                    preload="auto"
                    onContextMenu={(e) => e.preventDefault()}
                    {...mediaProps}
                />
                <div className={classes.audioOverlay} />
            </Box>
        );

    case MaterialTypename.VIDEO:
    default:
        return (
            <>
                <ReactPlayer
                    key={srcRef.current}
                    ref={reactPlayerRef}
                    playsinline
                    controls={false}
                    playing={videoReady && playing}
                    url={videoSources}
                    muted={muted}
                    className={classes.video}
                    height="100%"
                    width="100%"
                    config={{
                        file: {
                            attributes: {
                                crossOrigin: `anonymous`,
                                controlsList: `nodownload`,
                                onContextMenu: (e: Event) => e.preventDefault(),
                                ...mediaProps,
                            },
                        },
                    }}
                    onReady={(reactPlayer) => {
                        const videoElement = (reactPlayer as unknown as any).wrapper?.childNodes?.[0] as HTMLVideoElement;
                        if (!videoElement) return;
                        const { videoHeight, videoWidth } = videoElement;
                        onLoad?.({
                            height: videoHeight,
                            width: videoWidth,
                        });
                        if (videoReady) return;
                        reactPlayer.seekTo(timeRef.current || 0.0, `seconds`);
                        setVideoReady(true);
                    }}
                    onError={() => reactPlayerError()}
                />
                {(videoReady && muted) && (
                    <div
                        id="video-unmute-overlay"
                        style={{
                            position: `absolute`,
                            zIndex: 1,
                        }}
                    >
                        <IconButton
                            color={`primary`}
                            style={{
                                marginLeft: `20px`,
                                marginTop: `20px`,
                                backgroundColor: `#f6fafe`,
                            }}
                            onClick={() => {
                                setMuted(false);
                            }}
                        >
                            <AudioOffIcon size="3.5rem" />
                        </IconButton>
                    </div>
                )}
            </>
        );
    }
}

interface ReplicatedMediaProps extends Omit<React.VideoHTMLAttributes<HTMLMediaElement>, "onLoad">, WhiteboardLoadableElement {
    type: MaterialTypename.VIDEO | MaterialTypename.AUDIO;
}

export function ReplicatedMedia (props: ReplicatedMediaProps) {
    const {
        type,
        src,
        onLoad,
        ...mediaProps
    } = props;
    const classes = useStyles();
    const ref = useRef<HTMLMediaElement>(null);

    const reactPlayerRef = useRef<ReactPlayer>(null);
    const [ videoSources, setVideoSources ] = useState<string | string[] | undefined>(undefined);
    const [ playing, setPlaying ] = useState<boolean>(false);

    const { roomId, sessionId } = useSessionContext();

    const [ send, { error } ] = useSendVideoMessageMutation();

    useEffect(() => {
        // NOTE: Reset playing to false when the source changes.
        setPlaying(false);

        if (type !== MaterialTypename.AUDIO && src) {
            handleVideoSources(src, setVideoSources);
        } else {
            setVideoSources(undefined);
        }

        let currentTime = 0;
        if (ref.current) {
            currentTime = ref.current.currentTime;
        } else if (reactPlayerRef.current) {
            currentTime = 0;
        }

        send({
            variables: {
                roomId,
                sessionId,
                src,
                play: false,
                offset: Number.isFinite(currentTime) ? currentTime : undefined,
            },
        });
    }, [ src ]);

    useEffect(() => {
        if (!ref.current) return;
        const video = ref.current;

        function pause () {
            send({
                variables: {
                    roomId,
                    sessionId,
                    offset: Number.isFinite(video.currentTime)
                        ? video.currentTime
                        : undefined,
                    play: false,
                },
            });
        }
        function play () {
            send({
                variables: {
                    roomId,
                    sessionId,
                    offset: Number.isFinite(video.currentTime)
                        ? video.currentTime
                        : undefined,
                    play: true,
                },
            });
        }

        video.addEventListener(`play`, () => play());
        video.addEventListener(`playing`, () => play());
        video.addEventListener(`pause`, () => pause());
        video.addEventListener(`seeked`, () => pause());
        video.addEventListener(`seeking`, () => pause());

        return () => {
            video.removeEventListener(`play`, () => play());
            video.removeEventListener(`playing`, () => play());
            video.removeEventListener(`pause`, () => pause());
            video.removeEventListener(`seeked`, () => pause());
            video.removeEventListener(`seeking`, () => pause());
        };
    }, [ ref.current ]);

    const reactPlayerSynchronizeState = useCallback((isPlaying?: boolean) => {
        const player = reactPlayerRef.current;
        if (!player) {
            send({
                variables: {
                    roomId,
                    sessionId,
                    offset: undefined,
                    play: false,
                },
            });
            return;
        }

        let currentPlay = playing;
        const currentTime = player.getCurrentTime();

        if (isPlaying !== undefined) {
            setPlaying(isPlaying);
            currentPlay = isPlaying;
        }

        send({
            variables: {
                roomId,
                sessionId,
                offset: Number.isFinite(currentTime) ? currentTime : undefined,
                play: currentPlay,
            },
        });
    }, [
        send,
        reactPlayerRef.current,
        playing,
    ]);

    const reactPlayerError = useCallback(() => {
        // NOTE: Fallback to original src if there's an error.
        if (src && videoSources !== src) {
            setVideoSources(src);
        }
    }, [
        src,
        setVideoSources,
        videoSources,
    ]);

    if (error) {
        console.log(error);
        return <CircularProgress />;
    }

    switch (type) {
    case MaterialTypename.AUDIO:
        return (
            <Box
                height="100%"
                width="100%"
                display="flex"
                alignItems="center"
                justifyContent="center">
                <audio
                    ref={ref}
                    controls
                    playsInline
                    className={classes.audio}
                    src={src}
                    crossOrigin="anonymous"
                    controlsList="nodownload"
                    preload="auto"
                    onContextMenu={(e) => e.preventDefault()}
                    {...mediaProps}
                />
            </Box>
        );

    case MaterialTypename.VIDEO:
    default:
        return (
            <ReactPlayer
                ref={reactPlayerRef}
                controls
                playsinline
                url={videoSources}
                className={classes.video}
                height="100%"
                width="100%"
                config={{
                    file: {
                        attributes: {
                            crossOrigin: `anonymous`,
                            controlsList: `nodownload`,
                            onContextMenu: (e: Event) => e.preventDefault(),
                            ...mediaProps,
                        },
                    },
                }}
                onReady={(reactPlayer) => {
                    const videoElement = (reactPlayer as unknown as any).wrapper?.childNodes?.[0] as HTMLVideoElement;
                    if (!videoElement) return;
                    const { videoHeight, videoWidth } = videoElement;
                    onLoad?.({
                        height: videoHeight,
                        width: videoWidth,
                    });
                    reactPlayerSynchronizeState();
                }}
                onStart={() => {
                    reactPlayerSynchronizeState(true);
                }}
                onPlay={() => {
                    reactPlayerSynchronizeState(true);
                }}
                onPause={() => {
                    reactPlayerSynchronizeState(false);
                }}
                onSeek={() => {
                    reactPlayerSynchronizeState();
                }}
                onError={() => {
                    reactPlayerError();
                }}
            />
        );
    }
}
