import { RoomContext } from "@/providers/room/roomContext";
import { useContext } from "react";

export function useContent () {
    const { content } = useContext(RoomContext);
    return content;
}
