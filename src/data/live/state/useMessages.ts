import { RoomContext } from "@/providers/room/roomContext";
import {
    ChatMessageState,
    isStudent,
    isTeacher,
    newTimestamp,
    roles,
    UserRole,
} from "kidsloop-live-state/ui";
import { useContext } from "react";

export function useMessages (): ChatMessage[] {
    const { messages } = useContext(RoomContext);

    const newMessages = [ ...messages.values() ].map(m => newUserMessage({
        text: m.message,
        timestamp: newTimestamp(Number(m.id.split(`-`)[0])),
    }, {
        name: m.session.name,
        role: m.session.isTeacher ? roles.Teacher : roles.Student,
    }));
    return newMessages;
}

export type ChatMessage = ReturnType<typeof newUserMessage>;

function newUserMessage (m: Omit<ChatMessageState, 'userId'>, user: {name: string; role: UserRole} | undefined) {
    return {
        ...m,
        user: user ? newUser(user) : undefined,
    } as const;
}

export function newUser<T extends {role: UserRole}> (state: T) {
    return {
        ...state,
        isTeacher: isTeacher(state),
        isStudent: isStudent(state),
    } as const;
}
