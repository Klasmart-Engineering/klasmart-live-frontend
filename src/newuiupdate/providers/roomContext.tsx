import Loading from "../../components/loading";
import {
    Content, Message, Session,
} from "../../pages/room/room";
import { isChatOpenState, unreadMessagesState } from "../states/layoutAtoms";
import { LIVE_LINK, LocalSessionContext } from "./providers";
import { gql, useSubscription } from "@apollo/client";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import React, {
    createContext, useContext, useEffect, useState,
} from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

const SUB_ROOM = gql`
    subscription room($roomId: ID!, $name: String) {
        room(roomId: $roomId, name: $name) {
            message { id, message, session { name, isTeacher } },
            content { type, contentId },
            join { id, name, streamId, isTeacher, isHost, joinedAt },
            leave { id },
            session { webRTC { sessionId, description, ice, stream { name, streamId } } },
            sfu,
            trophy { from, user, kind },
        }
    }
`;

export interface RoomContextInterface {
    sfuAddress: string;
    messages: Map<string, Message>;
    content: Content | undefined;
    sessions: Map<string, Session>;
    trophy: any;
}

const defaultRoomContext = {
    sfuAddress: ``,
    messages: new Map<string, Message>(),
    content: undefined,
    sessions: new Map<string, Session>(),
    trophy: undefined,
};

export const RoomContext = createContext<RoomContextInterface>(defaultRoomContext);
export const RoomProvider = (props: {children: React.ReactNode}) => {
    const {
        roomId, name, sessionId,
    } = useContext(LocalSessionContext);
    const [ sfuAddress, setSfuAddress ] = useState<string>(``);
    const [ messages, setMessages ] = useState<Map<string, Message>>(new Map<string, Message>());
    const [ content, setContent ] = useState<Content>();
    const [ sessions, setSessions ] = useState<Map<string, Session>>(new Map<string, Session>());
    const [ trophy, setTrophy ] = useState();
    const [ unreadMessages, setUnreadMessages ] = useRecoilState(unreadMessagesState);
    const [ isChatOpen, setIsChatOpen ] = useRecoilState(isChatOpenState);

    useEffect(() => {
        isChatOpen && setUnreadMessages(0);
    }, [ isChatOpen, messages ]);

    const { loading, error } = useSubscription(SUB_ROOM, {
        onSubscriptionData: ({ subscriptionData }) => {
            if (!subscriptionData?.data?.room) { return; }
            const {
                message, content, join, leave, session, sfu, trophy,
            } = subscriptionData.data.room;
            if (sfu) { setSfuAddress(sfu); }
            if (message) { addMessage(message); }
            if (content) { setContent(content); }
            if (join) { userJoin(join); }
            if (leave) { userLeave(leave); }
            if (trophy) {
                if (trophy.from === trophy.user || trophy.user === sessionId || trophy.from === sessionId) {
                    setTrophy(trophy);
                }
            }
        },
        variables: {
            roomId,
            name,
        },
        context: {
            target: LIVE_LINK,
        },
    });

    const addMessage = (newMessage: Message) => {
        for (const id of messages.keys()) {
            if (messages.size < 32) { break; }
            setMessages((prev) => {
                const newState = new Map(prev);
                newState.delete(id);
                return newState;
            });
        }
        !isChatOpen && setUnreadMessages(unreadMessages + 1);
        setMessages(prev => new Map(prev.set(newMessage.id, newMessage)));
    };
    const userJoin = (join: Session) => setSessions(prev => new Map(prev.set(join.id, join)));

    const userLeave = (leave: Session) => {
        setSessions((prev) => {
            const newState = new Map(prev);
            newState.delete(leave.id);
            return newState;
        });
    };
    const value = {
        sfuAddress,
        messages,
        content,
        sessions,
        trophy,
    };

    if (loading || !content) { return <Grid
        container
        alignItems="center"
        style={{
            height: `100%`,
        }}><Loading messageId="loading" /></Grid>; }
    if (error) { return <Typography><FormattedMessage id="failed_to_connect" />{JSON.stringify(error)}</Typography>; }
    return <RoomContext.Provider value={value} >
        {props.children}
    </RoomContext.Provider>;
};
