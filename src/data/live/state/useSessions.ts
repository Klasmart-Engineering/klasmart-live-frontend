import { RoomContext } from "@/providers/room/roomContext";
import { useContext } from "react";

export function useSessions () {
    const { sessions } = useContext(RoomContext);
    return sessions;
}
