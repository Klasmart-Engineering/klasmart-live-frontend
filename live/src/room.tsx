import React, { useReducer, useState, useContext, useEffect, useCallback } from "react";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import { FormattedMessage } from "react-intl";
import { CircularProgress, Typography, useTheme, useMediaQuery } from "@material-ui/core";
import { sessionId, UserContext } from "./entry";
import { Student } from "./pages/student/student";
import { Teacher } from "./pages/teacher/teacher";
import { webRTCContext, WebRTC} from "./webRTCState";
import Layout from "./components/layout";
import { WhiteboardContextProvider } from "./whiteboard/context-provider/WhiteboardContextProvider";

export interface Session {
    id: string,
    name?: string
    streamId?: string
}

export interface Content {
    type: "Blank" | "Stream" | "Activity" | "Video",
    contentId: string,
}

export interface Message {
    id: string,
    message: string,
    session: Session,
}

const SUB_ROOM = gql`
    subscription room($roomId: ID!, $name: String) {
        room(roomId: $roomId, name: $name) {
        message { id, message, session { name } },
        content { type, contentId },
        join { id, name, streamId },
        leave { id }
        session { webRTC { sessionId, description, ice, stream { name, streamId } } }
        }
    }
`;

interface Props {
    teacher: boolean
}

export function Room ({ teacher }: Props): JSX.Element {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const {roomId, materials, name} = useContext(UserContext);
    const webrtc = useContext(webRTCContext);
    
    const [contentIndex, setContentIndex] = useState<number>(0);

    const [openDrawer, setOpenDrawer] = useState<boolean>(isSmDown ? false : true);
    const handleOpenDrawer = (open?: boolean) => {
        if (open !== null && open !== undefined) {
            setOpenDrawer(open);
        } else {
            setOpenDrawer(!openDrawer);
        }
    };

    const [content, setContent] = useState<Content>();
    const [messages, addMessage] = useReducer((state: Map<string, Message>, newMessage: Message) => {
        const newState = new Map<string, Message>();
        newState.set(newMessage.id, newMessage);
        for(const [id,message] of state) {
            if(newState.size >= 32) { break; }
            newState.set(id,message);
        }
        return newState;
    }, new Map<string, Message>());
    
    const [users, updateUsers] = useReducer(
        (state: Map<string,Session>, {join,leave}: {join?: Session, leave?: Session}) => {
            const newState = new Map<string, Session>([...state]);
            if(join) {
                newState.set(join.id, join);
                if(sessionId < join.id) {
                    webrtc.sendOffer(join.id);
                }
            }
            if(leave) { newState.delete(leave.id); }
            return newState;
        },
        new Map<string, Session>()
    );
    
    const { loading, error } = useSubscription(SUB_ROOM, {
        onSubscriptionData: ({ subscriptionData }) => {
            if (!subscriptionData) { return; }
            if (!subscriptionData.data) { return; }
            if (!subscriptionData.data.room) { return; }
            const { message, content, join, leave, session } = subscriptionData.data.room;
            if (message) { addMessage(message); }
            if (content) { setContent(content); }
            if (join || leave) { updateUsers(subscriptionData.data.room); }
            if(session && session.webRTC) { webrtc.notification(session.webRTC); }
        },
        variables: { roomId, name }
    });
    
    useEffect(() => {
        if (isSmDown) {
            setOpenDrawer(false);
        }
    }, [isSmDown]);
    if(error) {return <Typography ><FormattedMessage id="failed_to_connect" />{JSON.stringify(error)}</Typography>;}
    if(loading || !content) {return <CircularProgress />;}

    return (
        <WhiteboardContextProvider defaultAllowPaint={teacher}>
            <Layout
                isTeacher={teacher}
                users={users}
                messages={messages}
                openDrawer={openDrawer}
                handleOpenDrawer={handleOpenDrawer}
                contentIndexState={{ contentIndex, setContentIndex }}
            >
                {
                    teacher
                        ? <Teacher 
                            content={content} 
                            users={users} 
                            openDrawer={openDrawer}
                            handleOpenDrawer={handleOpenDrawer}
                            contentIndexState={{ contentIndex, setContentIndex }}
                        />
                        : <Student 
                            content={content}
                            openDrawer={openDrawer}
                            handleOpenDrawer={handleOpenDrawer}
                        />
                }
            </Layout>
        </WhiteboardContextProvider>
    );
}
