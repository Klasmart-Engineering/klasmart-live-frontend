import {
    MuteNotification,
    StreamDescription,
} from "@/providers/WebRTCContext";

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
