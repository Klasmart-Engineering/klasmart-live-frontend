
export interface UpdateMuteDto {
    mute: {
        sessionId: string;
        roomId: string;
        audio: boolean;
        video: boolean;
    };
}
