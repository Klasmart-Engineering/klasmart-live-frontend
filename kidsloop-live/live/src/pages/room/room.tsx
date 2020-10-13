import React, { useReducer, useState, useContext, createContext, useRef } from "react";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import { FormattedMessage } from "react-intl";
import { useTheme, useMediaQuery } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { sessionId, UserContext } from "../../entry";
import { Student } from "../student/student";
import { Teacher } from "../teacher/teacher";
import Loading from "../../components/loading";
import { EventEmitter } from "eventemitter3"
import { WebRTCSFUContext } from "../../webrtc/sfu";
import { ScreenShare } from "../teacher/screenShareProvider";
import { GlobalWhiteboardContext } from "../../whiteboard/context-providers/GlobalWhiteboardContext";
import NewLayout from "../layout-new";
import { Trophy } from "../../components/trophies/trophy";

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

export function Room(): JSX.Element {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const { teacher } = useContext(UserContext);

    const [contentIndex, setContentIndex] = useState<number>(0);
    const [interactiveMode, setInteractiveMode] = useState<number>(0);
    const [numColState, setNumColState] = useState(2)

    const [openDrawer, _] = useState<boolean>(true); // TODO: Redux?

    return (
        <RoomContext.Provide>
            <WebRTCSFUContext.Provide>
                <ScreenShare.Provide>
                    <GlobalWhiteboardContext>
                        <NewLayout
                            isTeacher={teacher}
                            contentIndexState={{ contentIndex, setContentIndex }}
                            interactiveModeState={{ interactiveMode, setInteractiveMode }}
                            numColState={numColState}
                            setNumColState={setNumColState}
                        >
                            {
                                teacher
                                    ? <Teacher
                                        openDrawer={openDrawer}
                                        contentIndexState={{ contentIndex, setContentIndex }}
                                        interactiveModeState={{ interactiveMode, setInteractiveMode }}
                                        numColState={numColState}
                                    />
                                    : <Student openDrawer={openDrawer} />
                            }
                        </NewLayout>
                    </GlobalWhiteboardContext>
                </ScreenShare.Provide>
            </WebRTCSFUContext.Provide>
            <Trophy />
        </RoomContext.Provide>
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
            sfu,
            trophy { from, user, kind },
        }
    }
`;

const context = createContext<{ value: RoomContext }>(undefined as any);
export class RoomContext {
    public static Provide(props: { children?: JSX.Element | JSX.Element[] }) {
        const { roomId, name } = useContext(UserContext);

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


        if (loading || !ref.current.content) { return <Grid container alignItems="center" style={{ height: "100%" }}><Loading messageId="loading" /></Grid>; }
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