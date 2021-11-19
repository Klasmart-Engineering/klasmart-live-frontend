import { RoomContext } from "@/providers/room/roomContext";
import { useContext } from "react";

export function useMessages () {
    const { messages } = useContext(RoomContext);
    return messages;
}
