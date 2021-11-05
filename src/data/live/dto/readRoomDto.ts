import {
    Content,
    Message,
    Session,
} from "@/pages/utils";

export interface ReadTrophyDto {
    user: string;
    from: string;
    kind: string;
}

export interface ReadRoomDto {
    room: {
        message?: Message;
        content?: Content;
        join?: Session;
        leave?: Session;
        sfu?: string;
        trophy?: ReadTrophyDto;
    };
}
