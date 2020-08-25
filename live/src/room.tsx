import React, { useReducer, useState, useContext, useEffect, useMemo, createContext, useRef } from "react";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import { FormattedMessage } from "react-intl";
import { useTheme, useMediaQuery } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { sessionId, UserContext } from "./entry";
import { Student } from "./pages/student/student";
import { Teacher } from "./pages/teacher/teacher";
import { webRTCContext } from "./webRTCState";
import Layout from "./components/layout";
import Loading from "./components/loading";
import { WhiteboardContextProvider } from "./whiteboard/context-provider/WhiteboardContextProvider";
import { EventEmitter } from "eventemitter3"

export interface Session {
    id: string,
    name?: string
    streamId?: string
}

export interface Content {
    type: "Blank" | "Stream" | "Activity" | "Video" | "Audio" | "Image" | "Camera" | "Screen",
    contentId: string,
}

export interface Message {
    id: string,
    message: string,
    session: Session,
}

export interface ContentIndexState {
    contentIndex: number;
    setContentIndex: React.Dispatch<React.SetStateAction<number>>;
}

export interface InteractiveModeState {
    interactiveMode: number;
    setInteractiveMode: React.Dispatch<React.SetStateAction<number>>;
}

export interface StreamIdState {
    streamId: string | undefined;
    setStreamId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface Props {
    teacher: boolean
}

export function Room({ teacher }: Props): JSX.Element {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const [contentIndex, setContentIndex] = useState<number>(0);
    const [interactiveMode, setInteractiveMode] = useState<number>(0);
    const [streamId, setStreamId] = useState<string>();
    const [numColState, setNumColState] = useState(2)

    const [openDrawer, setOpenDrawer] = useState<boolean>(isSmDown ? false : true);
    const handleOpenDrawer = (open?: boolean) => {
        if (open !== null && open !== undefined) {
            setOpenDrawer(open);
        } else {
            setOpenDrawer(!openDrawer);
        }
    };

    useEffect(() => {
        if (isSmDown) {
            setOpenDrawer(false);
        }
    }, [isSmDown]);

    return (
        <WhiteboardContextProvider>
            <Layout
                isTeacher={teacher}
                openDrawer={openDrawer}
                handleOpenDrawer={handleOpenDrawer}
                contentIndexState={{ contentIndex, setContentIndex }}
                interactiveModeState={{ interactiveMode, setInteractiveMode }}
                streamIdState={{ streamId, setStreamId }}
                numColState={numColState}
                setNumColState={setNumColState}
                >
                {
                    teacher
                    ? <Teacher
                        openDrawer={openDrawer}
                        handleOpenDrawer={handleOpenDrawer}
                        contentIndexState={{ contentIndex, setContentIndex }}
                        interactiveModeState={{ interactiveMode, setInteractiveMode }}
                        streamIdState={{ streamId, setStreamId }}
                        numColState={numColState}
                    />
                    : <Student />
                }
            </Layout>
        </WhiteboardContextProvider>
    );
}


const SUB_ROOM = gql`
    subscription room($roomId: ID!, $name: String) {
        room(roomId: $roomId, name: $name) {
            message { id, message, session { name } },
            content { type, contentId },
            join { id, name, streamId },
            leave { id },
            session { webRTC { sessionId, description, ice, stream { name, streamId } } },
            mute { sessionId, audio, video },
            trophy { from, user, kind },
        }
    }
`;

const context = createContext<{value: RoomContext}>(undefined as any);
export class RoomContext {
    public static Provide(props: {children?: JSX.Element | JSX.Element[]}) {
        const ref = useRef<RoomContext>(undefined as any)
        const [value, rerender] = useReducer(() => ({value:ref.current}),{value:ref.current})
        if(!ref.current) { ref.current = new RoomContext(rerender) }

        const { roomId, name } = useContext(UserContext);
        const webrtc = useContext(webRTCContext);
        const { loading, error } = useSubscription(SUB_ROOM, {
            onSubscriptionData: ({ subscriptionData }) => {
                if (!subscriptionData) { return; }
                if (!subscriptionData.data) { return; }
                if (!subscriptionData.data.room) { return; }
                const { message, content, join, leave, session, mute, trophy } = subscriptionData.data.room;
                if (message) { ref.current.addMessage(message); }
                if (content) { ref.current.setContent(content); }
                if (join) { 
                    ref.current.userJoin(join)
                    if (sessionId < join.id) {
                        webrtc.sendOffer(join.id);
                    }
                }
                if (leave) { ref.current.userLeave(leave) }
                if (session && session.webRTC) { webrtc.notification(session.webRTC); }
                if (mute) { webrtc.mute(mute.sessionId, mute.audio, mute.video); }
                if (trophy) { ref.current.emitter.emit("trophy",trophy); }
            },
            variables: { roomId, name }
        });

        
        if (loading || !ref.current.content) { return <Grid container alignItems="center" style={{ height: "100%" }}><Loading messageId="loading" /></Grid>; }
        if (error) { return <Typography><FormattedMessage id="failed_to_connect" />{JSON.stringify(error)}</Typography>; }
        return <context.Provider value={value} >
            {props.children}
        </context.Provider>
    }

    public static Consume() {
        return useContext(context).value
    }

    private rerender: React.DispatchWithoutAction
    private constructor(rerender: React.DispatchWithoutAction) {
        this.rerender = rerender
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