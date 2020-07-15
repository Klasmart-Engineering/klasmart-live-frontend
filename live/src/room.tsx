import React, { useReducer, useState, useContext, useEffect } from "react";
import { gql } from "apollo-boost";
import { useSubscription } from "@apollo/react-hooks";
import { FormattedMessage } from "react-intl";
import { CircularProgress, Typography, useTheme, useMediaQuery } from "@material-ui/core";
// import { Student } from './pages/student'
import { Student } from "./pages/student/student";
import { Teacher } from "./pages/teacher/teacher";
import { webRTCContext, WebRTCContext } from "./webRTCState";
import { sessionId, UserContext } from "./entry";
import Layout from "./components/layout";


export interface Session {
    id: string,
    name?: string
    streamId?: string
}

export interface Content {
    type: "Blank" | "Stream" | "Activity",
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
        session { webRTC { sessionId,offer,answer,ice } }
        }
    }
`;

interface Props {
    teacher: boolean
}

export function Room ({ teacher }: Props): JSX.Element {
    const theme = useTheme();
    const isSmDown = useMediaQuery(theme.breakpoints.down("sm"));

    const {roomId, name} = useContext(UserContext);
    
    const webRTCContextValue = WebRTCContext.useWebRTCContext(roomId);

    const [open, setOpen] = useState<boolean>(isSmDown ? false : true);
    const setOpenDrawer = () => {
        setOpen(!open);
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
                if(teacher && join.id != sessionId) {
                    webRTCContextValue.start(join.id);
                }
            }
            if(leave) { newState.delete(leave.id); }
            return newState;
        },
        new Map<string, Session>()
    );
    
    const { loading, error } = useSubscription(SUB_ROOM, {
        onSubscriptionData: async ({ subscriptionData }) => {
            if (!subscriptionData) { return; }
            if (!subscriptionData.data) { return; }
            if (!subscriptionData.data.room) { return; }
            const { message, content, join, leave, session } = subscriptionData.data.room;
            if (message) { addMessage(message); }
            if (content) { setContent(content); }
            if (join || leave) { updateUsers(subscriptionData.data.room); }
            if(session && session.webRTC) { await webRTCContextValue.notification(session.webRTC); }
        },
        variables: { roomId, name }
    });
    
    useEffect(() => {
        if (isSmDown) {
            setOpen(false);
        }
    }, [isSmDown]);

    if(error) {return <Typography ><FormattedMessage id="failed_to_connect" />{JSON.stringify(error)}</Typography>;}
    if(loading || !content) {return <CircularProgress />;}

    return <webRTCContext.Provider value={webRTCContextValue}>
        <Layout
            isTeacher={teacher}
            users={users}
            messages={messages}
            openDrawer={open}
            setOpenDrawer={setOpenDrawer}
        >
            {
                teacher
                    ? <Teacher 
                        content={content} 
                        users={users} 
                        openDrawer={open}
                        setOpenDrawer={setOpenDrawer}
                    />
                    : <Student 
                        content={content}
                        openDrawer={open}
                        setOpenDrawer={setOpenDrawer}
                    />
            }
        </Layout>
    </webRTCContext.Provider>;
}
