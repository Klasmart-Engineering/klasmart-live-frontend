import React, { useReducer, useState, useContext, useEffect, createContext, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { gql, useSubscription } from "@apollo/client"
import { FormattedMessage } from "react-intl";
import Typography from "@material-ui/core/Typography";
import Loading from "../../components/loading";
import { EventEmitter } from "eventemitter3"
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

const SUB_ROOM = gql`
    subscription room($roomId: ID!, $name: String) {
        room(roomId: $roomId, name: $name) {
            message { id, message, session { name } },
            content { type, contentId },
            join { id, name, streamId, isTeacher },
            leave { id },
            session { webRTC { sessionId, description, ice, stream { name, streamId } } },
            sfu,
            trophy { from, user, kind },
        }
    }
`;

const context = createContext<{ value: RoomContext }>(undefined as any);
export class RoomContext {
    public static Provide(props: { children?: JSX.Element | JSX.Element[] }) {
        const { roomId, name, sessionId } = useSessionContext();

        const ref = useRef<RoomContext>(undefined as any)
        const [value, rerender] = useReducer(() => ({ value: ref.current }), { value: ref.current })
        if (!ref.current) { ref.current = new RoomContext(rerender, roomId) }

        const { loading, error } = useSubscription(SUB_ROOM, {
            onSubscriptionData: ({ subscriptionData }) => {
                if (!subscriptionData) { return; }
                if (!subscriptionData.data) { return; }
                if (!subscriptionData.data.room) { return; }
                const { message, content, join, leave, session, sfu, trophy } = subscriptionData.data.room;
                if (message) { ref.current.addMessage(message); }
                if (content) { ref.current.setContent(content); }
                if (join) { ref.current.userJoin(join) }
                if (leave) { ref.current.userLeave(leave) }
                if (sfu) { ref.current.sfuAddress = sfu; rerender(); }
                if (trophy) {
                    if (trophy.from === trophy.user || trophy.user === sessionId || trophy.from === sessionId) {
                        ref.current.emitter.emit("trophy", trophy);
                    }
                }
            },
            variables: { roomId, name }
        });

        if (loading || !ref.current.content) { return <Loading messageId="loading" /> }
        if (error) { return <Typography><FormattedMessage id="failed_to_connect" />{JSON.stringify(error)}</Typography>; }
        return <context.Provider value={value} >
            {props.children}
        </context.Provider>
    }

    public static Consume() {
        return useContext(context).value
    }

    public roomId: string
    public sfuAddress?: string
    private rerender: React.DispatchWithoutAction
    private constructor(rerender: React.DispatchWithoutAction, roomId: string) {
        this.rerender = rerender
        this.roomId = roomId
    }

    public messages = new Map<string, Message>();
    private addMessage(newMessage: Message) {
        for (const id of this.messages.keys()) {
            if (this.messages.size < 32) { break; }
            this.messages.delete(id);
        }
        this.messages.set(newMessage.id, newMessage);
        this.rerender()
    }

    public content?: Content
    private setContent(content: Content) {
        this.content = content
        this.rerender()
    }

    public users = new Map<string, Session>()
    private userJoin(join: Session) {
        this.users.set(join.id, join);
        this.rerender()
    }
    private userLeave(leave: Session) {
        this.users.delete(leave.id);
        this.rerender()
    }

    public emitter = new EventEmitter()
}
