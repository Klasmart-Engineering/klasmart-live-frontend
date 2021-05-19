import { FFT } from "../../../../components/fft";
import ReactPlayer from "../../../../components/react-player/lazy";
import { MaterialTypename } from "../../../../lessonMaterialContext";
import { LIVE_LINK, LocalSessionContext } from '../../../providers/providers';
import {
    gql, useMutation, useSubscription,
} from "@apollo/client";
import {
    CircularProgress, IconButton, makeStyles,
    Theme, Typography,
} from "@material-ui/core";
import { VolumeMute as AudioOffIcon } from "@styled-icons/boxicons-regular/VolumeMute";
import React, {
    useCallback, useContext, useEffect, useRef,
    useState,
} from "react";

interface VideoSynchronize {
    src?: string;
    play?: boolean;
    offset?: number;
}

interface ReplicaVideoProps {
    sessionId: string;
    type: 'Audio' | 'Video';
}

const PLAYLIST_FILE_NAME = `master`;
const PLAYLIST_FILE_HOST = `/video`;

const useStyles = makeStyles((theme: Theme) => ({
    video: {
        width: `100% !important`,
        height: `100% !important`,
        position: `relative`,
        "& video":{
            objectFit: `contain`,
            position: `absolute`,
            top: 0,
            left: 0,
            width: `100%`,
            height: `100%`,
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

// Reference: https://stackoverflow.com/a/23522755
const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

export function ReplicaMedia (props: React.VideoHTMLAttributes<HTMLMediaElement> & ReplicaVideoProps) {
    const {
        sessionId, type, ...mediaProps
    } = props;
    const classes = useStyles();
    const srcRef = useRef<string>();
    const [ playing, setPlaying ] = useState<boolean>(false);
    const timeRef = useRef<number>();

    const [ muted, setMuted ] = useState<boolean>(isSafari);

    const { roomId } = useContext(LocalSessionContext);

    const ref = useRef<HTMLMediaElement>(null);
    const reactPlayerRef = useRef<ReactPlayer>(null);

    const [ videoSources, setVideoSources ] = useState<
        string | string[] | undefined
    >(undefined);
    const [ videoReady, setVideoReady ] = useState<boolean>(false);

    const reactPlayerError = useCallback((reason) => {
        // NOTE: Fallback to original src if there's an error.
        if (srcRef.current && videoSources !== srcRef.current) {
            setVideoSources(srcRef.current);
        }
    }, [
        srcRef.current,
        videoSources,
        setVideoSources,
    ]);

    const { loading, error } = useSubscription(gql`
      subscription video($roomId: ID!, $sessionId: ID!) {
        video(roomId: $roomId, sessionId: $sessionId) {
          src
          play
          offset
        }
      }
    `, {
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
                src, play, offset,
            } = subscriptionData.data
                .video as VideoSynchronize;

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

                if (type !== MaterialTypename.Audio) {
                    const sources = createHlsDashUrlFromSrc(src);

                    sources.push(src);

                    const playable = sources.filter((s) => ReactPlayer.canPlay(s));
                    if (playable.length > 0) {
                        setVideoSources(playable[0]);
                    }
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
                    ref.current.play().catch((e) => { });
                }
                if (play === false) {
                    ref.current.pause();
                }
            }

            if (reactPlayerRef.current && videoReady) {
                if (offset !== undefined) {
                    reactPlayerRef.current.seekTo(offset);
                }
            }
        },
        variables: {
            roomId,
            sessionId,
        },
        context: {
            target: LIVE_LINK,
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
            video.play().catch(() => { });
        }
        if (playing === false) {
            video.pause();
        }
    }, [ ref.current ]);

    if (loading) {
        return <CircularProgress />;
    }
    if (error) {
        return <Typography>{error}</Typography>;
    }
    switch (type) {
    case MaterialTypename.Audio:
        return (
            <>
                <FFT
                    input={ref.current}
                    output={true}
                    style={{
                        width: `100%`,
                    }}
                    width={1000}
                    height={500}
                />
                <audio
                    ref={ref}
                    playsInline
                    src={srcRef.current}
                    crossOrigin="anonymous"
                    controls={false}
                    controlsList="nodownload"
                    preload="auto"
                    onContextMenu={(e) => e.preventDefault()}
                    {...mediaProps}
                />
            </>
        );

    case MaterialTypename.Video:
    default:
        return (
            <>
                <ReactPlayer
                    key={srcRef.current}
                    ref={reactPlayerRef as React.RefObject<ReactPlayer>}
                    playsinline
                    controls={false}
                    playing={videoReady && playing}
                    url={videoSources}
                    muted={muted}
                    className={classes.video}
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
                    width="100%"
                    onReady={() => {
                        if (!videoReady && reactPlayerRef.current) {
                            reactPlayerRef.current.seekTo(timeRef.current || 0.0);
                        }

                        setVideoReady(true);

                    }}
                    onError={(_, reason) => reactPlayerError(reason)}
                />
                {videoReady && muted ?
                    <div
                        id="video-unmute-overlay"
                        style={{
                            position: `absolute`,
                            width: `100%`,
                            height: `100%`,
                            zIndex: 2000,
                        }}>
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
                    </div> : <></>
                }
            </>
        );
    }
}

interface ReplicatedMediaProps {
    type: MaterialTypename.Video | MaterialTypename.Audio;
}

export function ReplicatedMedia (props: React.VideoHTMLAttributes<HTMLMediaElement> & ReplicatedMediaProps) {
    const {
        type, src, ...mediaProps
    } = props;
    const classes = useStyles();
    const ref = useRef<HTMLMediaElement>(null);

    const reactPlayerRef = useRef<ReactPlayer>(null);
    const [ videoSources, setVideoSources ] = useState<
        string | string[] | undefined
    >(undefined);
    const [ playing, setPlaying ] = useState<boolean>(false);

    const { roomId, sessionId } = useContext(LocalSessionContext);

    const [ send, { loading, error } ] = useMutation(gql`
      mutation sendMessage(
        $roomId: ID!
        $sessionId: ID!
        $src: String
        $play: Boolean
        $offset: Float
      ) {
        video(
          roomId: $roomId
          sessionId: $sessionId
          src: $src
          play: $play
          offset: $offset
        )
      }
    `
    , {
        context: {
            target: LIVE_LINK,
        },
    });

    useEffect(() => {
        // NOTE: Reset playing to false when the source changes.
        setPlaying(false);

        if (type !== MaterialTypename.Audio && src) {
            const sources = createHlsDashUrlFromSrc(src);

            sources.push(src);

            const playable = sources.filter((s) => ReactPlayer.canPlay(s));
            if (playable.length > 0) {
                setVideoSources(playable[0]);
            }
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

    // if(loading) {return <CircularProgress />;}
    if (error) {
        return <Typography>{error}</Typography>;
    }

    switch (type) {
    case MaterialTypename.Audio:
        return (
            <audio
                ref={ref}
                controls
                playsInline
                src={src}
                crossOrigin="anonymous"
                controlsList="nodownload"
                preload="auto"
                onContextMenu={(e) => e.preventDefault()}
                {...mediaProps}
            />
        );

    case MaterialTypename.Video:
    default:
        return (
            <ReactPlayer
                ref={reactPlayerRef as React.RefObject<ReactPlayer>}
                controls
                playsinline
                url={videoSources}
                width="100%"
                className={classes.video}
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
                onReady={() => {
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
