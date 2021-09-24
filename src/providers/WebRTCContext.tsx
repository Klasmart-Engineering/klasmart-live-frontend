// @ts-ignore
import { SFU_LINK } from "./providers";
import { useSessionContext } from "./session-context";
import { Resolver } from "@/resolver";
import {
    gql,
    useMutation,
    useQuery,
    useSubscription,
} from "@apollo/client";
import {
    Device,
    types as MediaSoup,
} from "mediasoup-client";
import {
    Producer,
    ProducerOptions,
} from "mediasoup-client/lib/Producer";
import React,
{
    createContext,
    useEffect,
    useState,
} from "react";

const callstats: any = require(`callstats-js/callstats.min`);

const SEND_RTP_CAPABILITIES = gql`
    mutation rtpCapabilities($rtpCapabilities: String!) {
        rtpCapabilities(rtpCapabilities: $rtpCapabilities)
    }
`;
const TRANSPORT = gql`
    mutation transport($producer: Boolean!, $params: String!) {
        transport(producer: $producer, params: $params)
    }
`;
const PRODUCER = gql`
    mutation producer($params: String!) {
        producer(params: $params)
    }
`;
const CONSUMER = gql`
    mutation consumer($id: String!, $pause: Boolean) {
        consumer(id: $id, pause: $pause)
    }
`;
const STREAM = gql`
    mutation stream($id: String!, $producerIds: [String]!) {
        stream(id: $id, producerIds: $producerIds)
    }
`;
export const MUTE = gql`
    mutation mute($roomId: String!, $sessionId: String!, $audio: Boolean, $video: Boolean) {
        mute(roomId: $roomId, sessionId: $sessionId, audio: $audio, video: $video) {
            roomId,
            sessionId,
            audio,
            video,
        }
    }
`;
export const GLOBAL_MUTE_MUTATION = gql`
    mutation updateGlobalMute($roomId: String!, $audioGloballyMuted: Boolean, $videoGloballyDisabled: Boolean) {
        updateGlobalMute(roomId: $roomId, audioGloballyMuted: $audioGloballyMuted, videoGloballyDisabled: $videoGloballyDisabled) {
            roomId,
            audioGloballyMuted,
            videoGloballyDisabled,
        }
    }
`;
export const ENDCLASS = gql`
    mutation endClass($roomId: String) {
        endClass(roomId: $roomId)
    }
`;
export const GLOBAL_MUTE_QUERY = gql`
    query retrieveGlobalMute($roomId: String!) {
        retrieveGlobalMute(roomId: $roomId) {
            roomId,
            audioGloballyMuted,
            videoGloballyDisabled,
        }
    }
`;
export const INDIVIDUAL_MUTE_QUERY = gql`
    query retrieveMuteStatuses {
        retrieveMuteStatuses {
            roomId,
            sessionId,
            audio,
            video,
        }
    }
`;
const SUBSCRIBE = gql`
    subscription media($roomId: ID!) {
        media(roomId: $roomId) {
            rtpCapabilities,
            producerTransport,
            consumerTransport,
            consumer,
            stream {
                id,
                sessionId,
                producerIds,
            },
            mute {
                roomId,
                sessionId,
                audio,
                video,
            },
        }
    }
`;
export interface WebRTCContextInterface {
    getAuxStream: (sessionId: string) => MediaStream | undefined;
    getCameraStream: (sessionId: string) => MediaStream | undefined;
    transmitStream: (id: string, stream: MediaStream, simulcast: boolean) => Promise<MediaSoup.Producer[]>;
    toggleAudioByProducer: (id?: string) => void;
    isAudioEnabledByProducer: (id?: string) => boolean;
    enableAudioByProducer: (id?: string, enabled?: boolean) => void;
    toggleLocalAudio: (id?: string) => void;
    isAudioDisabledLocally: (id?: string) => boolean;
    toggleVideoByProducer: (id?: string) => void;
    isVideoEnabledByProducer: (id?: string) => boolean;
    enableVideoByProducer: (id?: string, enabled?: boolean) => void;
    toggleLocalVideo: (id?: string) => void;
    isVideoDisabledLocally: (id?: string) => boolean;
    inboundStreams: Map<string, StreamDescription>;
}

const defaultWebRTCContext = {
    getAuxStream: (sessionId: string) => { return undefined; },
    getCameraStream: (sessionId: string) => { return undefined; },
    transmitStream: async (id: string, stream: MediaStream, simulcast = true) => { return []; },
    toggleAudioByProducer: (id?: string) => { return; },
    isAudioEnabledByProducer: (id?: string) => { return false; },
    enableAudioByProducer: (id?: string, enabled?: boolean) => { return; },
    toggleLocalAudio: (id?: string) => { return; },
    isAudioDisabledLocally: (id?: string) => { return false; },
    toggleVideoByProducer: (id?: string) => { return; },
    isVideoEnabledByProducer: (id?: string) => { return false; },
    enableVideoByProducer: (id?: string, enabled?: boolean) => { return; },
    toggleLocalVideo: (id?: string) => { return; },
    isVideoDisabledLocally: (id?: string) => { return false; },
    inboundStreams: new Map<string, StreamDescription>(),
};

export const WebRTCContext = createContext<WebRTCContextInterface>(defaultWebRTCContext);

export const WebRTCProvider = (props: { children: React.ReactNode }) => {
    const {
        roomId,
        name,
        sessionId: localSessionId,
        camera,
        isTeacher,

    } = useSessionContext();
    const [ device, setDevice ] = useState<Device | undefined | null>();
    const [ producerTransport, setProducerTransport ] = useState<MediaSoup.Transport | undefined | null>();
    const [ consumerTransport, setConsumerTransport ] = useState<MediaSoup.Transport | undefined | null>();
    const [ consumers, setConsumers ] = useState<Map<string, MediaSoup.Consumer>>(new Map<string, MediaSoup.Consumer>());
    const [ inboundStreams, setInboundStreams ] = useState<Map<string, StreamDescription>>(new Map<string, StreamDescription>());
    const [ outboundStreams, setOutboundStreams ] = useState<Map<string, Stream>>(new Map<string, Stream>());
    const [ destructors, setDestructors ] = useState<Map<string, () => any>>(new Map<string, () => any>());
    const [ muteStatuses, setMuteStatuses ] = useState<Map<string, MuteNotification>>(new Map<string, MuteNotification>());

    const [ rtpCapabilitiesMutation ] = useMutation(SEND_RTP_CAPABILITIES, {
        context: {
            target: SFU_LINK,
        },
    });
    const [ transportMutation ] = useMutation(TRANSPORT, {
        context: {
            target: SFU_LINK,
        },
    });
    const [ producerMutation ] = useMutation(PRODUCER, {
        context: {
            target: SFU_LINK,
        },
    });
    const [ consumerMutation ] = useMutation(CONSUMER, {
        context: {
            target: SFU_LINK,
        },
    });
    const [ streamMutation ] = useMutation(STREAM, {
        context: {
            target: SFU_LINK,
        },
    });
    const { refetch } = useQuery(INDIVIDUAL_MUTE_QUERY, {
        context: {
            target: SFU_LINK,
        },
    });
    // const [endClassMutation] = useMutation(ENDCLASS);
    const devicePrePromise = Resolver<Device>();
    const producerTransportPrePromise = Resolver<MediaSoup.Transport>();
    const consumerTransportPrePromise = Resolver<MediaSoup.Transport>();

    const getAuxStream = (sessionId: string): MediaStream | undefined => {
        return inboundStreams.get(`${sessionId}_aux`)?.stream;
    };

    const getCameraStream = (sessionId: string): MediaStream | undefined => {
        return inboundStreams.get(`${sessionId}_camera`)?.stream;
    };

    const transmitStream = async (id: string, stream: MediaStream, simulcast = true): Promise<MediaSoup.Producer[]> => {
        console.log(`Transmit ${id}`);
        const transport = await initProducerTransport();
        console.log(`Transport`);
        const tracks = stream.getTracks();
        const producers: Producer[] = [];
        let producer: Producer;
        for (const track of tracks) {
            const params = {
                track,
                disableTrackOnPause: true,
                zeroRtpOnPause: true,
                stopTracks: true,
            } as ProducerOptions;
            if (track.kind === `video`) {
                const scalabilityMode = getVP9SvcScalabilityMode();
                const codecs = (await initDevice()).rtpCapabilities?.codecs;
                const vp9support = codecs?.find((c:any) => c.mimeType.toLowerCase() === `video/vp9`);
                if (scalabilityMode && !vp9support) { console.log(`Can not use scalability mode '${scalabilityMode}' as vp9 codec does not seem to be supported`); }
                if (scalabilityMode && vp9support) {
                    params.codec = {
                        kind: `video`,
                        mimeType: `video/VP9`,
                        clockRate: 90000,
                        parameters: {
                            'profile-id': 2,
                        },
                    };
                    params.encodings = [
                        {
                            scalabilityMode,
                            dtx: true,
                        },
                    ];
                } else if (simulcast) {
                    // These should be ordered from lowest bitrate to highest bitrate
                    // rid will be automatically assigned in the order of this array from "r0" to "rN-1"

                    params.encodings = [
                        {
                            maxBitrate: 100000,
                            maxFramerate: 15,
                            scaleResolutionDownBy: 4,
                            scalabilityMode: `S1T1`,
                            dtx: true,
                        },
                        {
                            maxBitrate: 200000,
                            maxFramerate: 15,
                            scaleResolutionDownBy: 2,
                            scalabilityMode: `S1T1`,
                            dtx: true,
                        },
                        {
                            maxBitrate: 400000,
                            maxFramerate: 15,
                            scaleResolutionDownBy: 1,
                            scalabilityMode: `S1T1`,
                            dtx: true,
                        },
                    ];
                } else {
                    params.encodings = [
                        {
                            maxBitrate: 400000,
                            maxFramerate: 15,
                            dtx: true,
                        },
                    ];
                }
                console.log(`Wait for video producer`);
                producer = await transport.produce(params);
                if (simulcast && !scalabilityMode) {
                    const layerCount = (params.encodings?.length || 1)-1;
                    await producer.setMaxSpatialLayer(layerCount);
                }
            } else {
                console.log(`Wait for audio producer`);
                params.codecOptions = {
                    opusDtx: true,
                    opusPtime: 10,
                    opusFec: true,
                    opusStereo: false,
                };
                params.encodings = [
                    {
                        dtx: true,
                    },
                ];
                producer = await transport.produce(params);
            }
            setDestructors(new Map(destructors.set(producer.id, () => producer.close())));
            producers.push(producer);
        }
        console.log(`Got producers`);
        setOutboundStreams(new Map(outboundStreams.set(id, {
            id,
            producers,
            audioEnabledByProducer: true,
            videoEnabledByProducer: true,
        })));
        const producerIds = producers.map(producer => producer.id);
        console.log(`Stream()(${producerIds})`);
        const { errors } = await streamMutation({
            variables: {
                id,
                producerIds,
            },
        });
        if (errors) {
            throw errors;
        }
        console.log(`Got stream`);
        return producers;
    };

    const toggleAudioByProducer = (id?: string): void => {
        return enableAudioByProducer(id);
    };

    const isAudioEnabledByProducer = (id?: string): boolean => {
        const stream = id === undefined || id === localSessionId
            ? outboundStreams.get(`camera`)
            : inboundStreams.get(`${id}_camera`);
        if (!stream) {
            return false;
        }
        return stream.audioEnabledByProducer;
    };

    const enableAudioByProducer = (id?: string, enabled?: boolean): void => {
        if (id === undefined || id === localSessionId) {
            // My Camera
            const stream = outboundStreams.get(`camera`);
            if (!stream) {
                return;
            }
            if (enabled === undefined) {
                enabled = !stream.audioEnabledByProducer;
            }
            if (stream.audioEnabledByProducer !== enabled) {
                stream.audioEnabledByProducer = enabled;
                setOutboundStreams(new Map(outboundStreams.set(stream.id, stream)));
            }

            for (const producer of stream.producers) {
                if (producer.kind === `audio` && stream.audioEnabledByProducer === producer.paused) {
                    if (stream.audioEnabledByProducer) {
                        producer.resume();
                    } else {
                        producer.pause();
                    }
                }
            }
        } else {
            // Other Camera
            const stream = inboundStreams.get(`${id}_camera`);
            const audioProducerId = stream?.producerIds?.find(id => consumers.get(id)?.track?.kind === `audio`) ?? ``;
            const consumer = consumers.get(audioProducerId);

            if (!stream || !consumer) {
                return;
            }

            if (stream.audioEnabledByProducer !== enabled) {
                stream.audioEnabledByProducer = enabled ?? !stream.audioEnabledByProducer;
                setInboundStreams(new Map(inboundStreams.set(stream.id, stream)));
            }
            consumer.track.enabled = stream.audioEnabledByProducer && !stream.audioDisabledLocally;
            setConsumers(new Map(consumers.set(consumer.producerId, consumer)));
        }
    };

    const toggleLocalAudio = (id?: string): void => {
        const stream = inboundStreams.get(`${id}_camera`);
        const audioProducerId = stream?.producerIds?.find(id => consumers.get(id)?.track?.kind === `audio`) ?? ``;
        const consumer = consumers.get(audioProducerId);

        if (!stream || !consumer) {
            return;
        }

        stream.audioDisabledLocally = !stream.audioDisabledLocally;
        setInboundStreams(new Map(inboundStreams.set(stream.id, stream)));
        consumer.track.enabled = stream.audioEnabledByProducer && !stream.audioDisabledLocally;
        setConsumers(new Map(consumers.set(consumer.producerId, consumer)));
    };

    const isAudioDisabledLocally = (id?: string): boolean => {
        const stream = inboundStreams.get(`${id}_camera`);
        if (!stream) {
            return false;
        }
        return stream.audioDisabledLocally;
    };

    const toggleVideoByProducer = (id?: string): void => {
        return enableVideoByProducer(id);
    };

    const isVideoEnabledByProducer = (id?: string): boolean => {
        const stream = id === undefined || id === localSessionId
            ? outboundStreams.get(`camera`)
            : inboundStreams.get(`${id}_camera`);
        if (!stream) {
            return false;
        }
        return stream.videoEnabledByProducer;
    };

    const enableVideoByProducer = (id?: string, enabled?: boolean): void => {
        if (id === undefined || id === localSessionId) {
            // My Camera
            const stream = outboundStreams.get(`camera`);
            console.log(`stream`, stream, outboundStreams);
            if (!stream) {
                return;
            }
            console.log(`enabled`, enabled);
            if (enabled === undefined) {
                enabled = !stream.videoEnabledByProducer;
            }
            console.log(`videoEnabledByProducer`, stream.videoEnabledByProducer);
            if (stream.videoEnabledByProducer !== enabled) {
                stream.videoEnabledByProducer = enabled;
                setOutboundStreams(new Map(outboundStreams.set(stream.id, stream)));
            }

            for (const producer of stream.producers) {
                console.log(`producer`, producer.kind, producer.track, producer.paused);
                if (producer.kind === `video` && stream.videoEnabledByProducer === producer.paused) {
                    if (stream.videoEnabledByProducer) {
                        console.log(`resume`);
                        producer.resume();
                    } else {
                        console.log(`pause`);
                        producer.pause();
                    }
                }
            }
        } else {
            // Other Camera
            const stream = inboundStreams.get(`${id}_camera`);
            const videoProducerId = stream?.producerIds?.find(id => consumers.get(id)?.track?.kind === `video`) ?? ``;
            const consumer = consumers.get(videoProducerId);

            if (!stream || !consumer) {
                return;
            }

            if (stream.videoEnabledByProducer !== enabled) {
                stream.videoEnabledByProducer = enabled ?? !stream.videoEnabledByProducer;
                setInboundStreams(new Map(inboundStreams.set(stream.id, stream)));
            }
            consumer.track.enabled = stream.videoEnabledByProducer && !stream.videoDisabledLocally;
            setConsumers(new Map(consumers.set(consumer.producerId, consumer)));
        }
    };

    const toggleLocalVideo = (id?: string): void => {
        const stream = inboundStreams.get(`${id}_camera`);
        const videoProducerId = stream?.producerIds?.find(id => consumers.get(id)?.track?.kind === `video`) ?? ``;
        const consumer = consumers.get(videoProducerId);

        if (!stream || !consumer) {
            return;
        }

        stream.videoDisabledLocally = !stream.videoDisabledLocally;
        setInboundStreams(new Map(inboundStreams.set(stream.id, stream)));
        consumer.track.enabled = stream.videoEnabledByProducer && !stream.videoDisabledLocally;
        setConsumers(new Map(consumers.set(consumer.producerId, consumer)));
    };

    const isVideoDisabledLocally = (id?: string): boolean => {
        const stream = inboundStreams.get(`${id}_camera`);
        if (!stream) {
            return false;
        }
        return stream.videoDisabledLocally;
    };

    const initDevice = async () => {
        if (device) {
            return device;
        }
        const { promise } = await devicePrePromise;
        return promise;
    };

    const initProducerTransport = async () => {
        if (producerTransport) {
            return producerTransport;
        }
        const { promise } = await producerTransportPrePromise;
        return promise;
    };

    const initConsumerTransport = async () => {
        if (consumerTransport) {
            return consumerTransport;
        }
        const { promise } = await consumerTransportPrePromise;
        return promise;
    };

    const getConsumer = async (producerId: string): Promise<MediaSoup.Consumer> => {
        let consumer: MediaSoup.Consumer | undefined = undefined;
        while (!consumer) {
            consumer = consumers.get(producerId);
            await new Promise(r => setTimeout(r, 100));
        }
        return consumer;
    };

    const rtpCapabilitiesMessage = async (message: string) => {

        const routerRtpCapabilities = JSON.parse(message);
        if (device) {
            console.error(`WebRTC device already initialized`);
            return;
        }
        if (device === null) {
            console.error(`WebRTC device is being initialized`);
            return;
        }
        setDevice(null);

        let webRTCDevice: Device;
        if (process.env.WEBRTC_DEVICE_HANDLER_NAME) {
            webRTCDevice = new Device({ handlerName: process.env.WEBRTC_DEVICE_HANDLER_NAME as any });
        } else {
            webRTCDevice = new Device();
        }

        await webRTCDevice.load({
            routerRtpCapabilities,
        });
        const rtpCapabilities = JSON.stringify(webRTCDevice.rtpCapabilities);
        await rtpCapabilitiesMutation({
            variables: {
                rtpCapabilities,
            },
        });
        const { resolver } = await devicePrePromise;
        setDevice(webRTCDevice);
        resolver(webRTCDevice);
    };

    const producerTransportMessage = async (message: string, roomId: string) => {
        const params = JSON.parse(message);
        if (producerTransport) {
            console.error(`Producer transport already initialized`);
            return;
        }
        if (producerTransport === null) {
            console.error(`Producer transport is being initialized`);
            return;
        }
        setProducerTransport(null);

        console.log(`Producer: wait device`);
        const device = await initDevice();
        console.log(`Producer: wait send transport`, params);
        const transport = device.createSendTransport(params);

        attachCallstatsFabric(transport, params, roomId, callstats.transmissionDirection.sendonly);

        setDestructors(new Map(destructors.set(transport.id, () => {
            terminateCallstatsFabric(transport, roomId);
            transport.close();
        })));

        transport.on(`connect`, async (connectParams:any, callback:any, errback:any) => {
            try {
                const { errors } = await transportMutation({
                    variables: {
                        producer: true,
                        params: JSON.stringify(connectParams),
                    },
                });
                if (errors) {
                    throw errors;
                }
                callback();
            } catch (error) {
                attachCallstatsError(transport, roomId, error);
                errback(error);
            }
        });
        transport.on(`produce`, async (produceParams:any, callback:any, errback:any) => {
            try {
                const params = JSON.stringify(Object.assign({
                    transportId: transport.id,
                }, produceParams));
                const { data, errors } = await producerMutation({
                    variables: {
                        params,
                    },
                });
                if (errors) {
                    throw errors;
                }
                callback({
                    id: data.producer,
                });
            } catch (error) {
                attachCallstatsError(transport, roomId, error);
                errback(error);
            }
        });

        console.log(`Producer: resolve`);
        const { resolver } = await producerTransportPrePromise;
        setProducerTransport(transport);
        resolver(transport);
        console.log(`Producer: resolved`);
    };

    const consumerTransportMessage = async (message: string, roomId: string) => {
        const params = JSON.parse(message);
        if (consumerTransport) {
            console.error(`Consumer transport already initialized`);
            return;
        }
        if (consumerTransport === null) {
            console.error(`Consumer transport is being initialized`);
            return;
        }
        setConsumerTransport(null);

        console.log(`Consumer: wait device`);
        const device = await initDevice();
        console.log(`Consumer: create recv transport`);
        const transport = device.createRecvTransport(params);

        attachCallstatsFabric(transport, params, roomId, callstats.transmissionDirection.receiveonly);

        setDestructors(new Map(destructors.set(transport.id, () => {
            terminateCallstatsFabric(transport, roomId);
            transport.close();
        })));

        transport.on(`connect`, async (connectParams:any, callback:any, errback:any) => {
            console.log(`Consumer: connect`);
            try {
                const { errors } = await transportMutation({
                    variables: {
                        producer: false,
                        params: JSON.stringify(connectParams),
                    },
                });
                if (errors) {
                    throw errors;
                }
                callback();
            } catch (error) {
                attachCallstatsError(transport, roomId, error);
                errback(error);
            }
        });

        console.log(`Consumer: resolve`);
        const { resolver } = await consumerTransportPrePromise;
        setConsumerTransport(transport);
        resolver(transport);
    };

    const attachCallstatsFabric = (transport: MediaSoup.Transport, params: any, roomId: string, direction: any) => {
        if (process.env.CALLSTATS_ENABLE !== `TRUE`) {
            return;
        }
        // Experimental, may not work on all browsers
        if (transport[`_handler`] !== undefined) {
            const handler = transport[`_handler`];
            if (handler[`_pc`] !== undefined) {
                const pc = handler[`_pc`];
                const fabricAttributes = {
                    remoteEndpointType: callstats.endpointType.server,
                    fabricTransmissionDirection: direction,
                };
                callstats.addNewFabric(pc, params.id, callstats.fabricUsage.multiplex, roomId, fabricAttributes);
            }
        }
    };

    const attachCallstatsError = (transport: MediaSoup.Transport, roomId: string, err: any) => {
        if (process.env.CALLSTATS_ENABLE !== `TRUE`) {
            return;
        }
        // Experimental, may not work on all browsers
        if (transport[`_handler`] !== undefined) {
            const handler = transport[`_handler`];
            if (handler[`_pc`] !== undefined) {
                const pc = handler[`_pc`];
                callstats.reportError(pc, roomId, callstats.webRTCFunctions.applicationLog, err);
            }
        }
    };

    const terminateCallstatsFabric = (transport: MediaSoup.Transport, roomId: string) => {
        if (process.env.CALLSTATS_ENABLE !== `TRUE`) {
            return;
        }
        // Experimental, may not work on all browsers
        if (transport[`_handler`] !== undefined) {
            const handler = transport[`_handler`];
            if (handler[`_pc`] !== undefined) {
                const pc = handler[`_pc`];
                callstats.sendFabricEvent(pc, callstats.fabricEvent.fabricTerminated, roomId);
            }
        }
    };

    const consumerMessage = async (consumerParams: string) => {
        console.log(`Consumer message`);
        const params = JSON.parse(consumerParams);

        const transport = await initConsumerTransport();
        console.log(`Consumer wait`);
        const consumer = await transport.consume(params);
        setDestructors(new Map(destructors.set(consumer.id, () => {
            consumer.close();
        })));
        console.log(`Consumer unpause`);
        await consumerMutation({
            variables: {
                id: consumer.id,
                pause: false,
            },
        });
        setConsumers(new Map(consumers.set(consumer.producerId, consumer)));
        console.log(`Consumer done`);
    };

    const streamMessage = async (stream: StreamDescription) => {
        console.log(`streamMessage`, stream);
        const muteStatus = muteStatuses.get(stream.sessionId);
        console.log(`muteStatus`, muteStatus);
        Object.assign(stream, {
            videoEnabledByProducer: muteStatus ? muteStatus.video : true,
            audioEnabledByProducer: muteStatus ? muteStatus.audio : true,
            audioDisabledLocally: false,
            videoDisabledLocally: false,
        });
        const tracks = [] as MediaStreamTrack[];
        for (const producerId of stream.producerIds) {
            const consumer = await getConsumer(producerId);
            tracks.push(consumer.track);
        }
        stream.stream = new MediaStream(tracks);
        setInboundStreams(new Map(inboundStreams.set(`${stream.sessionId}_${stream.id}`, stream)));
    };

    const muteMessage = (muteNotification: MuteNotification) => {
        console.log(`muteMessage`, muteNotification);
        if (muteNotification.audio && !isAudioEnabledByProducer(muteNotification.sessionId)) {
            toggleAudioByProducer(muteNotification.sessionId);
        } else if (muteNotification.audio === false && isAudioEnabledByProducer(muteNotification.sessionId)) {
            toggleAudioByProducer(muteNotification.sessionId);
        }
        if (muteNotification.video && !isVideoEnabledByProducer(muteNotification.sessionId)) {
            toggleVideoByProducer(muteNotification.sessionId);
        } else if (muteNotification.video === false && isVideoEnabledByProducer(muteNotification.sessionId)) {
            toggleVideoByProducer(muteNotification.sessionId);
        }
    };

    const closeMessage = async (id: string) => {
        const destructor = destructors.get(id);
        if (!destructor) {
            return;
        }
        setDestructors((prev) => {
            const newState = new Map(prev);
            newState.delete(id);
            return newState;
        });
        destructor();
    };

    const value = {
        getAuxStream,
        getCameraStream,
        transmitStream,
        toggleAudioByProducer,
        isAudioEnabledByProducer,
        enableAudioByProducer,
        toggleLocalAudio,
        isAudioDisabledLocally,
        toggleVideoByProducer,
        isVideoEnabledByProducer,
        enableVideoByProducer,
        toggleLocalVideo,
        isVideoDisabledLocally,
        inboundStreams,
    };

    useSubscription(SUBSCRIBE, {
        onSubscriptionData: ({ subscriptionData }) => {
            if (!subscriptionData?.data?.media) {
                return;
            }
            const {
                rtpCapabilities,
                producerTransport,
                consumerTransport,
                consumer,
                stream,
                close,
                mute,
            } = subscriptionData.data.media;
            if (rtpCapabilities) {
                rtpCapabilitiesMessage(rtpCapabilities);
            }
            if (producerTransport) {
                producerTransportMessage(producerTransport, roomId);
            }
            if (consumerTransport) {
                consumerTransportMessage(consumerTransport, roomId);
            }
            if (consumer) {
                consumerMessage(consumer);
            }
            if (stream) {
                streamMessage(stream);
            }
            if (close) {
                closeMessage(close);
            }
            if (mute) {
                muteMessage(mute);
            }
        },
        variables: {
            roomId,
        },
        context: {
            target: SFU_LINK,
        },
    });

    useEffect(() => {
        if(!process.env.IS_CORDOVA_BUILD){
            // TODO: Temporarily hide this line for the app to avoid crashing on iOS, it needs to be investigated further.
            callstats.initialize(`881714000`, `OV6YSSRJ0fOA:vr7quqij46jLPMpaBXTAF50F2wFTqP4acrxXWVs9BIk=`, name + `:` + localSessionId);
        }
    }, [ name, localSessionId ]);

    useEffect(() => {
        if (!camera) {
            return;
        }
        const useSimulcast = isTeacher;
        const promise = transmitStream(`camera`, camera, useSimulcast);
        return () => {
            promise.then((producers) => producers.forEach(producer => {
                if (producer) {
                    producer.close();
                }
            }));
        };
    }, [ camera, producerTransport ]);

    const syncMuteStatuses = async () => {
        const { data } = await refetch();
        const muteStatuses: Map<string, MuteNotification> = new Map<string, MuteNotification>();
        for (const muteStatus of data.retrieveMuteStatuses) {
            muteStatuses.set(muteStatus.sessionId, muteStatus);
        }
        setMuteStatuses(muteStatuses);
        console.log(`muteStatuses`, muteStatuses);
    };
    useEffect(() => {
        syncMuteStatuses();
    }, []);

    return (
        <WebRTCContext.Provider value={value}>
            {props.children}
        </WebRTCContext.Provider>
    );
};

interface StreamDescription {
    id: string;
    sessionId: string;
    producerIds: string[];
    videoEnabledByProducer: boolean;
    videoDisabledLocally: boolean;
    audioEnabledByProducer: boolean;
    audioDisabledLocally: boolean;
    stream?: MediaStream;
}

interface Stream {
    id: string;
    producers: MediaSoup.Producer[];
    videoEnabledByProducer: boolean;
    audioEnabledByProducer: boolean;
}

export interface MuteNotification {
    roomId: string;
    sessionId: string;
    audio?: boolean;
    video?: boolean;
}

export interface GlobalMuteNotification {
    roomId: string;
    audioGloballyMuted?: boolean;
    videoGloballyDisabled?: boolean;
}

function getVP9SvcScalabilityMode () {
    const useVP9 = process.env.USE_VP9 ? true : false;
    if (!useVP9) { return; }
    const defaultMode = process.env.VP9_DEFAULT_SVC_MODE || `L3T3_KEY_SHIFT`;
    const getParameters = new URLSearchParams(window.location.search);
    const mode = getParameters.get(`svc`);
    switch (mode) {
    case `none`:
        return;
    case `L1T2`:
    case `L1T2h`:
    case `L1T3`:
    case `L1T3h`:
    case `L2T1`:
    case `L2T1h`:
    case `L2T1_KEY`:
    case `L2T2`:
    case `L2T2h`:
    case `L2T2_KEY`:
    case `L2T2_KEY_SHIFT`:
    case `L2T3`:
    case `L2T3h`:
    case `L2T3_KEY`:
    case `L2T3_KEY_SHIFT`:
    case `L3T1`:
    case `L3T1h`:
    case `L3T1_KEY`:
    case `L3T2`:
    case `L3T2h`:
    case `L3T2_KEY`:
    case `L3T2_KEY_SHIFT`:
    case `L3T3`:
    case `L3T3h`:
    case `L3T3_KEY`:
    case `L3T3_KEY_SHIFT`:
    case `S2T1`:
    case `S2T1h`:
    case `S2T2`:
    case `S2T2h`:
    case `S2T3`:
    case `S2T3h`:
    case `S3T1`:
    case `S3T1h`:
    case `S3T2`:
    case `S3T2h`:
    case `S3T3`:
    case `S3T3h`:
        console.log(`Using scalable video codec mode '${mode}'`);
        return mode;
    case undefined:
    case null:
        console.log(`Unspecified video codec scalability mode defaulting to '${defaultMode}'`);
        return defaultMode;
    default:
        console.log(`Unknown video codec scalability mode '${mode}' defaulting to '${defaultMode}'`);
        return defaultMode;
    }
}
