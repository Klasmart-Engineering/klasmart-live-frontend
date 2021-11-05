
export interface QueryGlobalMuteDto {
    retrieveGlobalMute: {
        roomId: string;
        audioGloballyMuted: boolean;
        videoGloballyDisabled: boolean;
    };
}
