
export interface QueryIndividualMuteDto {
    retrieveMuteStatuses: {
        roomId: string;
        sessionId: string;
        audio: boolean;
        video: boolean;
    }[];
}
