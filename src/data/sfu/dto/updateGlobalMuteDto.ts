
export interface UpdateGlobalMuteDto {
    updateGlobalMute: {
        roomId: string;
        audioGloballyMuted?: boolean;
        videoGloballyDisabled?: boolean;
    };
}
