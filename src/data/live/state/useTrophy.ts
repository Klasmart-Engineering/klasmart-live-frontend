import { RoomContext } from "@/providers/room/roomContext";
import { useContext } from "react";

export function useTrophy () {
    const { trophy } = useContext(RoomContext);
    return trophy;
}
