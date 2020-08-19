import React, { useRef, useEffect, useContext, useCallback, useState } from "react";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { CircularProgress, Typography } from "@material-ui/core";
import { UserContext } from "../entry";
import { MaterialTypename } from "../lessonMaterialContext";
import { FFT } from "../components/fft";
import ReactPlayer from "react-player/lazy";

interface VideoSynchronize {
    src?: string
    play?: boolean
    offset?: number
}

interface ReplicaVideoProps {
    sessionId: string
    type: MaterialTypename.Video | MaterialTypename.Audio
}

export function ReplicaMedia(props: React.VideoHTMLAttributes<HTMLMediaElement> & ReplicaVideoProps) {
    const { sessionId, type, ...mediaProps } = props
    const srcRef = useRef<string>();
    const [playing, setPlaying] = useState<boolean>(false);
    const timeRef = useRef<number>();

    const { roomId } = useContext(UserContext);

    const ref = useRef<HTMLMediaElement>(null);
    const reactPlayerRef = useRef<ReactPlayer>(null);

    const [videoReady, setVideoReady] = useState<boolean>(false);

    const { loading, error } = useSubscription(
        gql`
            subscription video($roomId: ID!, $sessionId: ID!) {
                video(roomId: $roomId, sessionId: $sessionId) {
                    src,
                    play,
                    offset,
                }
            }
        `,
        {
            onSubscriptionData: ({ subscriptionData }) => {
                if (!subscriptionData) { return; }
                if (!subscriptionData.data) { return; }
                if (!subscriptionData.data.video) { return; }

                const { src, play, offset } = subscriptionData.data.video as VideoSynchronize;

                if (src && srcRef.current !== src) {
                    setVideoReady(false);
                }

                if (src) { srcRef.current = src; }

                if (play !== undefined) setPlaying(play)
                if (offset !== undefined) { timeRef.current = offset; }

                if (ref.current) {
                    if (src) { ref.current.src = src; }
                    if (offset !== undefined) { ref.current.currentTime = offset; }
                    if (play === true) { ref.current.play().catch((e) => { }); }
                    if (play === false) { ref.current.pause(); }
                }

                if (reactPlayerRef.current && videoReady) {
                    if (offset !== undefined) { reactPlayerRef.current.seekTo(offset); }
                }
            },
            variables: { roomId, sessionId }
        }
    );

    useEffect(() => {
        if (!ref.current) { return; }
        const video = ref.current;
        if (srcRef.current !== undefined) { video.src = srcRef.current; }
        if (timeRef.current !== undefined && Number.isFinite(timeRef.current)) { video.currentTime = timeRef.current; }
        if (playing === true) { video.play().catch(() => { }); }
        if (playing === false) { video.pause(); }
    }, [ref.current]);

    if (loading) { return <CircularProgress />; }
    if (error) { return <Typography>{error}</Typography>; }
    switch (type) {
        case MaterialTypename.Audio:
            return <>
                <FFT input={ref.current} output={true} style={{ width: "100%" }} width={1000} height={500} />
                <audio
                    ref={ref}
                    src={srcRef.current}
                    crossOrigin="anonymous"
                    controls={false}
                    controlsList="nodownload"
                    preload="auto"
                    playsInline
                    onContextMenu={(e) => e.preventDefault()}
                    {...mediaProps}
                />
            </>;

        case MaterialTypename.Video:
        default:
            return <ReactPlayer
                ref={reactPlayerRef as React.RefObject<ReactPlayer>}
                controls={false}
                playing={videoReady && playing}
                playsinline
                url={srcRef.current}
                config={{
                    file: {
                        attributes: {
                            crossOrigin: "anonymous",
                            controlsList: "nodownload",
                            onContextMenu: (e: Event) => e.preventDefault(),
                            ...mediaProps,
                        }
                    }
                }}
                onReady={() => setVideoReady(true)}
            />;
    }
}

interface ReplicatedMediaProps {
    type: MaterialTypename.Video | MaterialTypename.Audio
}

export function ReplicatedMedia(props: React.VideoHTMLAttributes<HTMLMediaElement> & ReplicatedMediaProps) {
    const { type, src, ...mediaProps } = props

    const ref = useRef<HTMLMediaElement>(null);

    const reactPlayerRef = useRef<ReactPlayer>(null);
    const [playing, setPlaying] = useState<boolean>(false);

    const { roomId, sessionId } = useContext(UserContext);

    const [send, { loading, error }] = useMutation(
        gql`
            mutation sendMessage($roomId: ID!, $sessionId: ID!, $src: String, $play: Boolean, $offset: Float) {
                video(roomId: $roomId, sessionId: $sessionId, src: $src, play: $play, offset: $offset)
            }
        `
    );

    useEffect(() => {
        // TODO: Transform the src to use hls/dash instead of mp4.
        console.log(src)
        console.log(type)

        let currentTime = 0
        if (ref.current) {
            currentTime = ref.current.currentTime;
        } else if (reactPlayerRef.current) {
            currentTime = reactPlayerRef.current.getCurrentTime();
        }

        send({
            variables: {
                roomId,
                sessionId,
                src,
                play: false,
                offset: Number.isFinite(currentTime) ? currentTime : 0,
            }
        });
    }, [src]);

    useEffect(() => {
        if (!ref.current) return;
        const video = ref.current;

        function pause() { send({ variables: { roomId, sessionId, offset: Number.isFinite(video.currentTime) ? video.currentTime : undefined, play: false } }); }
        function play() { send({ variables: { roomId, sessionId, offset: Number.isFinite(video.currentTime) ? video.currentTime : undefined, play: true } }); }

        video.addEventListener("play", () => play());
        video.addEventListener("playing", () => play());
        video.addEventListener("pause", () => pause());
        video.addEventListener("seeked", () => pause());
        video.addEventListener("seeking", () => pause());


        return () => {
            video.removeEventListener("play", () => play());
            video.removeEventListener("playing", () => play());
            video.removeEventListener("pause", () => pause());
            video.removeEventListener("seeked", () => pause());
            video.removeEventListener("seeking", () => pause());
        };
    }, [ref.current]);

    const reactPlayerSynchronizeState = useCallback((isPlaying?: boolean) => {
        const player = reactPlayerRef.current;
        if (!player) {
            send({ variables: { roomId, sessionId, offset: undefined, play: false } });
            return;
        }

        let currentPlay = playing;
        const currentTime = player.getCurrentTime();

        if (isPlaying !== undefined) {
            setPlaying(isPlaying);
            currentPlay = isPlaying;
        }

        send({ variables: { roomId, sessionId, offset: Number.isFinite(currentTime) ? currentTime : undefined, play: currentPlay } })

    }, [send, reactPlayerRef.current, playing]);

    // if(loading) {return <CircularProgress />;}
    if (error) { return <Typography>{error}</Typography>; }

    switch (type) {
        case MaterialTypename.Audio:
            return <audio
                ref={ref}
                src={src}
                crossOrigin="anonymous"
                controls
                controlsList="nodownload"
                preload="auto"
                playsInline
                onContextMenu={(e) => e.preventDefault()}
                {...mediaProps}
            />;

        case MaterialTypename.Video:
        default:
            return <ReactPlayer
                ref={reactPlayerRef as React.RefObject<ReactPlayer>}
                controls
                playsinline
                url={src}
                config={{
                    file: {
                        attributes: {
                            crossOrigin: "anonymous",
                            controlsList: "nodownload",
                            onContextMenu: (e: Event) => e.preventDefault(),
                            ...mediaProps,
                        }
                    }
                }}
                onReady={() => { reactPlayerSynchronizeState(); }}
                onStart={() => { reactPlayerSynchronizeState(true); }}
                onPlay={() => { reactPlayerSynchronizeState(true); }}
                onPause={() => { reactPlayerSynchronizeState(false); }}
                onSeek={() => { reactPlayerSynchronizeState(); }}
            />;
    }

}