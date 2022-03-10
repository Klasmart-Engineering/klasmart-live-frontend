export interface ReadMediaDto {
    media: {
        rtpCapabilities?: string;
        producerTransport?: string;
        consumerTransport?: string;
        consumer?: string;
        stream?: StreamDescription;
        mute?: MuteNotification;
        close: string;
    };
}

export interface StreamDescription {
    id: string;
    sessionId: string;
    producerIds: string[];
    videoEnabledByProducer: boolean;
    videoDisabledLocally: boolean;
    audioEnabledByProducer: boolean;
    audioDisabledLocally: boolean;
    stream?: MediaStream;
}
export interface MuteNotification {
    roomId: string;
    sessionId: string;
    audio?: boolean;
    video?: boolean;
}