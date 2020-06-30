import { useSubscription } from "@apollo/react-hooks";
import { CircularProgress, Typography } from "@material-ui/core";
import { gql } from "apollo-boost";
import React, { useContext, useReducer, useState } from "react";
import { FormattedMessage } from "react-intl";
import { UserContext } from "./app";
import { Messages } from "./messages";
import { Student } from "./pages/student";
import { Teacher } from "./pages/teacher/teacher";
import { SendMessage } from "./sendMessage";

export interface Session {
  id: string;
  name?: string;
  streamId?: string;
}

export interface Content {
  type: "Blank" | "Stream" | "Activity";
  contentId: string;
}

export interface Message {
  id: string;
  message: string;
  session: Session;
}

const SUB_ROOM = gql`
  subscription room($roomId: ID!, $name: String) {
    room(roomId: $roomId, name: $name) {
      message { id, message, session { name } },
      content { type, contentId },
      join { id, name, streamId },
      leave { id }
    }
  }
`;

interface Props {
  teacher: boolean;
}

export function Room({ teacher }: Props): JSX.Element {
    const {roomId, name} = useContext(UserContext);

    const [content, setContent] = useState<Content>();
    const [messages, addMessage] = useReducer((state: Map<string, Message>, newMessage: Message) => {
        const newState = new Map<string, Message>();
        newState.set(newMessage.id, newMessage);
        for (const [id, message] of state) {
            if (newState.size >= 32) { break; }
            newState.set(id, message);
        }
        return newState;
    }, new Map<string, Message>());
    const [users, updateUsers] = useReducer(
        (state: Map<string, Session>, {join, leave}: {join?: Session, leave?: Session}) => {
            const newState = new Map<string, Session>([...state]);
            if (join) { newState.set(join.id, join); }
            if (leave) { newState.delete(leave.id); }
            return newState;
        },
        new Map<string, Session>(),
    );

    const { loading, error } = useSubscription(SUB_ROOM, {
        onSubscriptionData: ({ subscriptionData }) => {
            if (!subscriptionData) { return; }
            if (!subscriptionData.data) { return; }
            if (!subscriptionData.data.room) { return; }
            const { message, content, join, leave } = subscriptionData.data.room;
            if (message) { addMessage(message); }
            if (content) { setContent(content); }
            if (join || leave) { updateUsers(subscriptionData.data.room); }
        },
        variables: { roomId, name },
    });

    if (error) {return <Typography ><FormattedMessage id="live_failedToConnect" />{JSON.stringify(error)}</Typography>; }
    if (loading || !content) {return <CircularProgress />; }
    return <>
        {
            teacher
                ? <Teacher users={users} content={content}/>
                : <Student content={content} />
        }
        <SendMessage />
        <Messages messages={messages}/>
    </>;
}
