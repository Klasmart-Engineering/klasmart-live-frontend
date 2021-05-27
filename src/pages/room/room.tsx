import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { State } from "../../store/store";
import { OrientationType } from "../../store/actions";
import { useSessionContext } from "../../context-provider/session-context";
import { lockOrientation } from "../../utils/screenUtils";
import { setContentIndex, setDrawerTabIndex } from "../../store/reducers/control";
import { Classes } from "./classes";
import { Live } from "./live";
import { Study } from "./study";
import { RoomProvider } from "../../providers/RoomContext";
import { Trophy } from "../../components/trophies/trophy";
import { LiveSessionLinkProvider } from "../../context-provider/live-session-link-context";

export enum ContentType {
    Blank = "Blank",
    Stream = "Stream",
    Activity = "Activity",
    Video = "Video",
    Audio = "Audio",
    Image = "Image",
    Camera = "Camera",
    Screen = "Screen",
}

// TODO create a new file for enums
export enum InteractiveMode {
    Blank,
    Present,
    Observe,
    ShareScreen,
}
export interface Session {
    id: string
    name?: string
    streamId?: string
    isTeacher?: boolean
    isHost?: boolean
    joinedAt: number
}

export interface Content {
    type: ContentType,
    contentId: string,
}

export interface Message {
    id: string,
    message: string,
    session: Session,
}
export interface InteractiveModeState {
    interactiveMode: number;
    setInteractiveMode: React.Dispatch<React.SetStateAction<number>>;
}

export interface StreamIdState {
    streamId: string | undefined;
    setStreamId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export function Room(): JSX.Element {
    const dispatch = useDispatch();
    const classType = useSelector((state: State) => state.session.classType);

    const [interactiveMode, setInteractiveMode] = useState<number>(0);
    const [streamId, setStreamId] = useState<string>();

    useEffect(() => {
        lockOrientation(OrientationType.LANDSCAPE, dispatch);
        dispatch(setDrawerTabIndex(0));
        dispatch(setContentIndex(0));
    }, []);

    switch (classType) {
        case "study":
            return (
                <Study
                    interactiveModeState={{ interactiveMode: 1, setInteractiveMode }}
                    streamIdState={{ streamId, setStreamId }}
                />
            )
        case "class":
            return (
                <Classes
                    interactiveModeState={{ interactiveMode: 1, setInteractiveMode }}
                    streamIdState={{ streamId, setStreamId }}
                />
            )
        default:
            return (
                <Live
                    interactiveModeState={{ interactiveMode, setInteractiveMode }}
                    streamIdState={{ streamId, setStreamId }}
                />
            );
    }
}

export function RoomWithContext(): JSX.Element {

    const { sessionId, token, roomId } = useSessionContext();

    return (
        <LiveSessionLinkProvider sessionId={sessionId} token={token} roomId={roomId}>
            <RoomProvider>
                <Room />
                <Trophy />
            </RoomProvider>
        </LiveSessionLinkProvider>
    );
}
