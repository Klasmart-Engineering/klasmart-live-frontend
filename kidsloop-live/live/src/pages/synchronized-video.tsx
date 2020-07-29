import React, { useRef, useEffect, useContext } from "react";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { CircularProgress, Typography } from "@material-ui/core";
import { UserContext } from "../entry";

interface VideoSynchronize {
    src?: string
    play?: boolean
    offset?: number
}

interface ReplicaVideoProps {
    sessionId: string
}

export function ReplicaVideo(props: React.VideoHTMLAttributes<HTMLVideoElement> & ReplicaVideoProps) {
    const {sessionId, ...videoProps} = props
    const srcRef = useRef<string>();
    const playingRef = useRef<boolean>();
    const timeRef = useRef<number>();

    const {roomId} = useContext(UserContext);

    const ref = useRef<HTMLVideoElement>(null);
    const {loading, error} = useSubscription(
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
                
                const {src, play, offset} = subscriptionData.data.video as VideoSynchronize;
                
                if(src) { srcRef.current = src; }
                if(play !== undefined) {playingRef.current = play;}
                if(offset !== undefined) {timeRef.current = offset;}

                if(!ref.current) {return;}
                if(src) {ref.current.src = src; }
                if(offset !== undefined) {ref.current.currentTime = offset;}
                if(play === true) { ref.current.play().catch((e) => {}); }
                if(play === false) { ref.current.pause(); }

            },
            variables: {roomId, sessionId}
        }
    );

    useEffect(() => {
        if(!ref.current) {return;}
        const video = ref.current;
        if(srcRef.current !== undefined) {video.src = srcRef.current;}
        if(timeRef.current !== undefined && Number.isFinite(timeRef.current)) {video.currentTime = timeRef.current;}
        if(playingRef.current === true) {video.play().catch(() => {});}
        if(playingRef.current === false) {video.pause();}
    }, [ref.current]);

    if(loading) {return <CircularProgress />;}
    if(error) {return <Typography>{error}</Typography>;}
    return <video
        ref={ref}
        src={srcRef.current}
        crossOrigin="anonymous"
        controls={false}
        controlsList="nodownload"
        preload="auto"
        playsInline
        onContextMenu={(e) => e.preventDefault() }
        {...videoProps}
    />;
}

export function ReplicatedVideo(videoProps: React.VideoHTMLAttributes<HTMLVideoElement>) {
    const ref = useRef<HTMLVideoElement>(null);
    const src = videoProps.src;
    const {roomId, sessionId} = useContext(UserContext);

    const [send,{loading, error}] = useMutation(
        gql`
            mutation sendMessage($roomId: ID!, $sessionId: ID!, $src: String, $play: Boolean, $offset: Float) {
                video(roomId: $roomId, sessionId: $sessionId, src: $src, play: $play, offset: $offset)
            }
        `
    );

    useEffect(()=> {
        send({
            variables: {
                roomId,
                sessionId,
                src,
                play: false,
                offset: ref.current && Number.isFinite(ref.current.currentTime)?ref.current.currentTime:0,
            }
        });
    },[src]);

    useEffect(() => {
        if(!ref.current) {return;}
        const video = ref.current;

        function pause() { send({variables: {roomId, sessionId, offset: Number.isFinite(video.currentTime)?video.currentTime:undefined, play: false}}); }
        function play() { send({variables: {roomId, sessionId, offset: Number.isFinite(video.currentTime)?video.currentTime:undefined, play: true}}); }

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

    // if(loading) {return <CircularProgress />;}
    if(error) {return <Typography>{error}</Typography>;}
    return <video
        ref={ref}
        crossOrigin="anonymous"
        controls
        controlsList="nodownload"
        preload="auto"
        playsInline
        onContextMenu={(e) => e.preventDefault() }
        {...videoProps}
    />;
}