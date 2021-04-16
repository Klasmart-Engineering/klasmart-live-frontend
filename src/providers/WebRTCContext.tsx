// @ts-ignore
import { gql, useMutation, useSubscription } from "@apollo/client";
import {
    Device,
    types as MediaSoup
} from "mediasoup-client";
import { Producer, ProducerOptions } from "mediasoup-client/lib/Producer";
import React, { createContext, useContext, useEffect, useState } from "react";
import { LocalSessionContext, SFU_LINK } from "../entry";
import { PrePromise, Resolver } from "../resolver";

const callstats: any = require('callstats-js/callstats.min');

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
export const GLOBAL_MUTE_QUERY= gql`
    query retrieveGlobalMute($roomId: String!) {
        retrieveGlobalMute(roomId: $roomId) {
            roomId,
            audioGloballyMuted,
            videoGloballyDisabled,
        }
    }
`;
export const SUBSCRIBE = gql`
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
            globalMute {
                roomId,
                audioGloballyMuted,
                videoGloballyDisabled,
            },
        }
    }
`;
export interface WebRTCContextInterface {
    getAuxStream: (sessionId: string) => MediaStream | undefined
    getCameraStream: (sessionId: string) => MediaStream | undefined
    getTracks: (id: string) => MediaStreamTrack[],
    transmitStream: (id: string, stream: MediaStream, simulcast: boolean) => Promise<MediaSoup.Producer[]>
    localAudioToggle: (id?: string) => void,
    isLocalAudioEnabled: (id?: string) => boolean,
    localAudioEnable: (id?: string) => void,
    localVideoToggle: (id?: string) => void,
    isLocalVideoEnabled: (id?: string) => boolean,
    localVideoEnable: (id?: string) => void,
    inboundStreams: Map<string, StreamDescription>,
}

const defaultWebRTCContext = {
    getAuxStream: (sessionId: string) => {return undefined},
    getCameraStream: (sessionId: string) => {return undefined},
    getTracks: (id: string) => {return []},
    transmitStream: async (id: string, stream: MediaStream, simulcast = true) => {return []},
    localAudioToggle: (id?: string) => {},
    isLocalAudioEnabled: (id?: string) => {return false},
    localAudioEnable: (id?: string) => {},
    localVideoToggle: (id?: string) => {},
    isLocalVideoEnabled: (id?: string) => {return false},
    localVideoEnable: (id?: string) => {},
    inboundStreams: new Map<string, StreamDescription>(),
}

export const WebRTCContext = createContext<WebRTCContextInterface>(defaultWebRTCContext);

export const WebRTCProvider = (props: {children: React.ReactNode}) => {
    const { roomId, name, sessionId, camera } = useContext(LocalSessionContext);
    const [device, setDevice] = useState<Device | undefined | null>();
    const [producerTransport, setProducerTransport] = useState<MediaSoup.Transport | undefined | null>();
    const [consumerTransport, setConsumerTransport] = useState<MediaSoup.Transport | undefined | null>();
    const [consumerPrePromises, setConsumerPrePromises] = useState<Map<string, PrePromise<MediaSoup.Consumer>>>(new Map<string, PrePromise<MediaSoup.Consumer>>());
    const [tracks, setTracks] = useState<Map<string, MediaStreamTrack>>(new Map<string, MediaStreamTrack>());
    const [consumers, setConsumers] = useState<Map<string, MediaSoup.Consumer>>(new Map<string, MediaSoup.Consumer>());
    const [inboundStreams, setInboundStreams] = useState<Map<string, StreamDescription>>(new Map<string, StreamDescription>());
    const [outboundStreams, setOutboundStreams] = useState<Map<string, Stream>>(new Map<string, Stream>());
    const [destructors, setDestructors] = useState<Map<string, () => any>>(new Map<string, () => any>());

    const [rtpCapabilitiesMutation] = useMutation(SEND_RTP_CAPABILITIES, {context: {target: SFU_LINK}});
    const [transportMutation] = useMutation(TRANSPORT, {context: {target: SFU_LINK}});
    const [producerMutation] = useMutation(PRODUCER, {context: {target: SFU_LINK}});
    const [consumerMutation] = useMutation(CONSUMER, {context: {target: SFU_LINK}});
    const [streamMutation] = useMutation(STREAM, {context: {target: SFU_LINK}});
    // const [endClassMutation] = useMutation(ENDCLASS);
    const devicePrePromise = Resolver<Device>();
    const producerTransportPrePromise = Resolver<MediaSoup.Transport>();
    const consumerTransportPrePromise = Resolver<MediaSoup.Transport>();

    const getStream = (id: string): MediaStream | undefined => {
        const stream = inboundStreams.get(id)
        return stream?.stream
    }

    const getAuxStream = (sessionId: string): MediaStream | undefined => {
        return getStream(`${sessionId}_aux`)
    }

    const getCameraStream = (sessionId: string): MediaStream | undefined => {
        return getStream(`${sessionId}_camera`)
    }

    const getTracks = (id: string): MediaStreamTrack[] => {
        const stream = inboundStreams.get(id)
        console.log("getTracks: inboundStreams\n", inboundStreams)
        console.log(`stream - ${id}`, stream)
        return stream?.producerIds
            .map((producerId) => tracks.get(producerId))
            .filter((track) => track !== undefined) as MediaStreamTrack[]
    }
    const transmitStream = async (id: string, stream: MediaStream, simulcast = true): Promise<MediaSoup.Producer[]> => {
        console.log(`Transmit ${id}`)
        const transport = await initProducerTransport()
        console.log(`Transport`)
        const tracks = stream.getTracks()
        const producers: Producer[] = []
        let producer: Producer
        for (const track of tracks) {
            const params = {track} as ProducerOptions
            if (track.kind === "video") {
                const scalabilityMode = getVP9SvcScalabilityMode()
                const codecs = (await initDevice()).rtpCapabilities?.codecs
                const vp9support = codecs?.find((c) => c.mimeType.toLowerCase() === 'video/vp9');
                if(scalabilityMode && !vp9support) { console.log(`Can not use scalability mode '${scalabilityMode}' as vp9 codec does not seem to be supported`) } 
                if(scalabilityMode && vp9support) {
                    params.codec = {
                        kind: 'video',
                        mimeType: 'video/VP9',
                        clockRate: 90000,
                        parameters: {
                            'profile-id': 2
                        },
                    };
                    params.encodings = [ { scalabilityMode, dtx: true } ];
                } else if(simulcast) {
                    // These should be ordered from lowest bitrate to highest bitrate
                    // rid will be automatically assigned in the order of this array from "r0" to "rN-1"
                    params.encodings = [
                        { maxBitrate: 1000000, scaleResolutionDownBy: 4, scalabilityMode: 'S1T1', dtx: true },
                        { maxBitrate: 2000000, scaleResolutionDownBy: 2, scalabilityMode: 'S1T1', dtx: true },
                        { maxBitrate: 4000000, scaleResolutionDownBy: 1, scalabilityMode: 'S1T1', dtx: true },
                    ];
                } else {
                    params.encodings = [
                        { dtx: true },
                    ];
                }
                console.log(`Wait for video producer`)
                producer = await transport.produce(params)
                if(simulcast && !scalabilityMode) { await producer.setMaxSpatialLayer(2) }
            } else {
                console.log(`Wait for audio producer`)
                params.encodings = [{ dtx: true }]
                producer = await transport.produce(params)
            }
            setDestructors(new Map(destructors.set(producer.id, () => producer.close())));
            producers.push(producer)
        }
        console.log(`Got producers`)
        console.log(producers)
        setOutboundStreams(new Map(outboundStreams.set(id, {id, producers, audioEnabled: true, videoEnabled: true})));
        const producerIds = []
        for (const producer of producers) {
            if (producer) {
                producerIds.push(producer.id)
            }
        }
        if (producers.length === 0) {
            throw new Error("No producers")
        }
        console.log(`Stream()(${producerIds})`)
        const { errors } = await streamMutation({ variables: { id, producerIds } })
        if (errors) {
            throw errors
        }
        console.log(`Got stream`)
        return producers
    }

    const localAudioToggle = (id?: string): void => {
        return localAudioEnable(id);
    }

    const isLocalAudioEnabled = (id?: string): boolean => {
        const stream = id === undefined || id === sessionId
            ? outboundStreams.get("camera")
            : inboundStreams.get(`${id}_camera`)
        if (!stream) {
            return false
        }
        return stream.audioEnabled
    }

    const localAudioEnable = (id?: string, enabled?: boolean): void => {
        if (id === undefined || id === sessionId) {
            // My Camera
            const stream = outboundStreams.get("camera")
            if (!stream) {
                return
            }
            if (enabled === undefined) {
                enabled = !stream.audioEnabled
            }
            if (stream.audioEnabled !== enabled) {
                stream.audioEnabled = enabled
                setOutboundStreams(new Map(outboundStreams.set(stream.id, stream)));
            }

            for (const producer of stream.producers) {
                if (producer.kind === "audio" && stream.audioEnabled === producer.paused) {
                    if (stream.audioEnabled) {
                        producer.resume()
                    } else {
                        producer.pause()
                    }
                }
            }
        } else {
            // Other Camera
            const tracks = getTracks(`${id}_camera`)
            if (!tracks) {
                return
            }
            const stream = inboundStreams.get(`${id}_camera`)
            if (!stream) {
                return
            }
            if (enabled === undefined) {
                enabled = !stream.audioEnabled
            }
            if (stream.audioEnabled !== enabled) {
                stream.audioEnabled = enabled
                setInboundStreams(new Map(inboundStreams.set(stream.id, stream)));
            }

            for (const track of tracks) {
                if (track.kind === "audio") {
                    track.enabled = stream.audioEnabled
                }
            }
        }
    }


    const localVideoToggle = (id?: string): void => {
        return localVideoEnable(id)
    }

    const isLocalVideoEnabled = (id?: string): boolean => {
        const stream = id === undefined || id === sessionId
            ? outboundStreams.get("camera")
            : inboundStreams.get(`${id}_camera`)
        if (!stream) {
            return false
        }
        return stream.videoEnabled
    }

    const localVideoEnable = (id?: string, enabled?: boolean): void => {
        if (id === undefined || id === sessionId) {
            // My Camera
            const stream = outboundStreams.get("camera")
            console.log("stream", stream, outboundStreams)
            if (!stream) {
                return
            }
            console.log("enabled", enabled)
            if (enabled === undefined) {
                enabled = !stream.videoEnabled
            }
            console.log("videoEnabled", stream.videoEnabled)
            if (stream.videoEnabled !== enabled) {
                stream.videoEnabled = enabled
                setOutboundStreams(new Map(outboundStreams.set(stream.id, stream)));
            }

            for (const producer of stream.producers) {
                console.log("producer", producer.kind, producer.track, producer.paused)
                if (producer.kind === "video" && stream.videoEnabled === producer.paused) {
                    if (stream.videoEnabled) {
                        console.log("resume")
                        producer.resume()
                    } else {
                        console.log("pause")
                        producer.pause()
                    }
                }
            }
        } else {
            // Other Camera
            const tracks = getTracks(`${id}_camera`)
            console.log("tracks", tracks)
            if (!tracks) {
                return
            }
            const stream = inboundStreams.get(`${id}_camera`)
            console.log("stream", stream)
            if (!stream) {
                return
            }
            if (enabled === undefined) {
                enabled = !stream.videoEnabled
            }
            console.log("enabled", enabled)
            if (stream.videoEnabled !== enabled) {
                console.log("videoEnabled", stream.videoEnabled)
                stream.videoEnabled = enabled
                setInboundStreams(new Map(inboundStreams.set(stream.id, stream)));
            }

            for (const track of tracks) {
                console.log("track", track)
                if (track.kind === "video") {
                    track.enabled = stream.videoEnabled
                }
            }
        }
    }

    const initDevice = async () => {
        if (device) {
            return device
        }
        const { promise } = await devicePrePromise 
        return promise
    }

    const initProducerTransport = async () => {
        if (producerTransport) {
            return producerTransport
        }
        const { promise } = await producerTransportPrePromise
        return promise
    }


    const initConsumerTransport = async () => {
        if (consumerTransport) {
            return consumerTransport
        }
        const { promise } = await consumerTransportPrePromise
        return promise
    }

    const getConsumer = async(producerId: string) => {
        const consumer = consumers.get(producerId)
        if (consumer) {
            return consumer
        }
        let prePromise = consumerPrePromises.get(producerId)
        if (!prePromise) {
            prePromise = Resolver<MediaSoup.Consumer>()
            setConsumerPrePromises(new Map(consumerPrePromises.set(producerId, prePromise)));
        }
        const { promise } = await prePromise
        return promise
    }

    const rtpCapabilitiesMessage = async (message: string) => {

        const routerRtpCapabilities = JSON.parse(message)
        if (device) {
            console.error("WebRTC device already initialized");
            return;
        }
        if (device === null) {
            console.error("WebRTC device is being initialized");
            return;
        }
        setDevice(null);

        const webRTCDevice = new Device()
        await webRTCDevice.load({ routerRtpCapabilities })
        const rtpCapabilities = JSON.stringify(webRTCDevice.rtpCapabilities)
        await rtpCapabilitiesMutation({ variables: { rtpCapabilities } })
        const { resolver } = await devicePrePromise;
        setDevice(webRTCDevice);
        resolver(webRTCDevice)
    }

    const producerTransportMessage = async (message: string, roomId: string) => {
        const params = JSON.parse(message)
        if (producerTransport) {
            console.error("Producer transport already initialized");
            return;
        }
        if (producerTransport === null) {
            console.error("Producer transport is being initialized");
            return;
        }
        setProducerTransport(null)

        console.log("Producer: wait device")
        const device = await initDevice()
        console.log("Producer: wait send transport", params)
        const transport = device.createSendTransport(params)

        attachCallstatsFabric(transport, params, roomId, callstats.transmissionDirection.sendonly)

        setDestructors(new Map(destructors.set(transport.id, () => {
            terminateCallstatsFabric(transport, roomId)
            transport.close()
        })));

        transport.on("connect", async (connectParams, callback, errback) => {
            try {
                const { errors } = await transportMutation({
                    variables: {
                        producer: true,
                        params: JSON.stringify(connectParams),
                    },
                })
                if (errors) {
                    throw errors
                }
                callback()
            } catch (error) {
                attachCallstatsError(transport, roomId, error)
                errback(error)
            }
        })
        transport.on("produce", async (produceParams, callback, errback) => {
            try {
                const params = JSON.stringify(
                    Object.assign({ transportId: transport.id }, produceParams)
                )
                const { data, errors } = await producerMutation({
                    variables: { params },
                })
                if (errors) {
                    throw errors
                }
                callback({ id: data.producer })
            } catch (error) {
                attachCallstatsError(transport, roomId, error)
                errback(error)
            }
        }
        )

        console.log("Producer: resolve")
        const { resolver } = await producerTransportPrePromise
        setProducerTransport(transport)
        resolver(transport)
        console.log("Producer: resolved")
    }

    const consumerTransportMessage = async (message: string, roomId: string) => {
        const params = JSON.parse(message)
        if (consumerTransport) {
            console.error("Consumer transport already initialized");
            return;
        }
        if (consumerTransport === null) {
            console.error("Consumer transport is being initialized");
            return;
        }
        setConsumerTransport(null)

        console.log("Consumer: wait device")
        const device = await initDevice()
        console.log("Consumer: create recv transport")
        const transport = device.createRecvTransport(params)

        attachCallstatsFabric(transport, params, roomId, callstats.transmissionDirection.receiveonly);

        setDestructors(new Map(destructors.set(transport.id, () => {
            terminateCallstatsFabric(transport, roomId)
            transport.close()
        })));

        transport.on("connect", async (connectParams, callback, errback) => {
            console.log("Consumer: connect")
            try {
                const { errors } = await transportMutation({
                    variables: {
                        producer: false,
                        params: JSON.stringify(connectParams),
                    },
                })
                if (errors) {
                    throw errors
                }
                callback()
            } catch (error) {
                attachCallstatsError(transport, roomId, error)
                errback(error)
            }
        })

        console.log("Consumer: resolve")
        const { resolver } = await consumerTransportPrePromise
        setConsumerTransport(transport)
        resolver(transport)
    }

    const attachCallstatsFabric = (transport: MediaSoup.Transport, params: any, roomId: string, direction: any) => {
        if (process.env.CALLSTATS_ENABLE !== "TRUE") {
            return
        }
        // Experimental, may not work on all browsers
        if (transport["_handler"] !== undefined) {
            const handler = transport["_handler"]
            if (handler["_pc"] !== undefined) {
                const pc = handler["_pc"]
                const fabricAttributes = {
                    remoteEndpointType: callstats.endpointType.server,
                    fabricTransmissionDirection: direction
                }
                callstats.addNewFabric(pc, params.id, callstats.fabricUsage.multiplex, roomId, fabricAttributes)
            }
        }
    }

    const attachCallstatsError = (transport: MediaSoup.Transport, roomId: string, err: any) => {
        if (process.env.CALLSTATS_ENABLE !== "TRUE") {
            return
        }
        // Experimental, may not work on all browsers
        if (transport["_handler"] !== undefined) {
            const handler = transport["_handler"]
            if (handler["_pc"] !== undefined) {
                const pc = handler["_pc"]
                callstats.reportError(pc, roomId, callstats.webRTCFunctions.applicationLog, err)
            }
        }
    }

    const terminateCallstatsFabric = (transport: MediaSoup.Transport, roomId: string) => {
        if (process.env.CALLSTATS_ENABLE !== "TRUE") {
            return
        }
        // Experimental, may not work on all browsers
        if (transport["_handler"] !== undefined) {
            const handler = transport["_handler"]
            if (handler["_pc"] !== undefined) {
                const pc = handler["_pc"]
                callstats.sendFabricEvent(pc, callstats.fabricEvent.fabricTerminated, roomId)
            }
        }
    }

    const consumerMessage = async (consumerParams: string) => {
        console.log("Consumer message")
        const params = JSON.parse(consumerParams)

        const transport = await initConsumerTransport()
        console.log("Consumer wait")
        const consumer = await transport.consume(params)
        setDestructors(new Map(destructors.set(consumer.id, () => {
            consumer.close()
        })));
        console.log("Consumer unpause")
        consumerMutation({ variables: { id: consumer.id, pause: false } })
        setTracks(new Map(tracks.set(consumer.producerId, consumer.track)));
        setConsumers(new Map(consumers.set(consumer.producerId, consumer)));
        const prePromise = consumerPrePromises.get(consumer.producerId)
        if (prePromise) {
            const { resolver } = await prePromise
            resolver(consumer)
        }
        console.log("Consumer done")
    }

    const streamMessage = async (stream: StreamDescription) => {
        console.log("streamMessage", stream)
        const {
            id,
            sessionId,
            producerIds
        } = stream
        Object.assign(stream, { videoEnabled: true, audioEnabled: true })
        setInboundStreams(new Map(inboundStreams.set(`${sessionId}_${id}`, stream)));
        const tracks = [] as MediaStreamTrack[]
        for (const producerId of producerIds) {
            const consumer = await getConsumer(producerId)
            tracks.push(consumer.track)
        }
        stream.stream = new MediaStream(tracks)
        setInboundStreams(new Map(inboundStreams.set(stream.id, stream)));
    }

    const muteMessage = (muteNotification: MuteNotification) => {
        console.log("muteMessage", muteNotification)
        const {
            audio,
            video
        } = muteNotification

        const stream = inboundStreams.get(`${muteNotification.sessionId}_camera`)
        if (stream) {
            if (audio && !isLocalAudioEnabled(muteNotification.sessionId)) {
                localAudioToggle(muteNotification.sessionId)
            } else if (audio === false && isLocalAudioEnabled(muteNotification.sessionId)) {
                localAudioToggle(muteNotification.sessionId)
            }
            if (video && !isLocalVideoEnabled(muteNotification.sessionId)) {
                localVideoToggle(muteNotification.sessionId)
            } else if (video === false && isLocalVideoEnabled(muteNotification.sessionId)) {
                localVideoToggle(muteNotification.sessionId)
            }
        } else if (sessionId === muteNotification.sessionId) {
            if (audio && !isLocalAudioEnabled()) {
                localAudioToggle()
            } else if (audio === false && isLocalAudioEnabled()) {
                localAudioToggle()
            }
            if (video && !isLocalVideoEnabled()) {
                localVideoToggle()
            } else if (video === false && isLocalVideoEnabled()) {
                localVideoToggle()
            }
        }
    }

    const closeMessage = async (id: string) => {
        const destructor = destructors.get(id)
        if (!destructor) {
            return
        }
        setDestructors((prev) => {
            const newState = new Map(prev);
            newState.delete(id);
            return newState;
          });
        destructor()
    }


    const value = {
        getAuxStream,
        getCameraStream,
        getTracks,
        transmitStream,
        localAudioToggle,
        isLocalAudioEnabled,
        localAudioEnable,
        localVideoToggle,
        isLocalVideoEnabled,
        localVideoEnable,
        inboundStreams,
    }

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
                globalMute
            } = subscriptionData.data.media
            if (rtpCapabilities) {
                rtpCapabilitiesMessage(rtpCapabilities)
            }
            if (producerTransport) {
                producerTransportMessage(producerTransport, roomId)
            }
            if (consumerTransport) {
                consumerTransportMessage(consumerTransport, roomId)
            }
            if (consumer) {
                consumerMessage(consumer)
            }
            if (stream) {
                streamMessage(stream)
            }
            if (close) {
                closeMessage(close)
            }
            if (mute) {
                muteMessage(mute)
            }
        },
        variables: { roomId },
        context: {target: SFU_LINK}
    })

    useEffect(() => {
        callstats.initialize("881714000", "OV6YSSRJ0fOA:vr7quqij46jLPMpaBXTAF50F2wFTqP4acrxXWVs9BIk=", name + ":" + sessionId)
    }, [name, sessionId])


    useEffect(() => {
        if (!camera) {
            return
        }
        const promise = transmitStream("camera", camera)
        return () => {
            promise.then((producers) => producers.forEach(producer => {
                if (producer) {
                    producer.close()
                }
            }))
        }
    }, [camera,producerTransport])

    return (
            <WebRTCContext.Provider value={value}>
                {props.children}
            </WebRTCContext.Provider>
    )
}

interface StreamDescription {
    id: string
    sessionId: string
    producerIds: string[]
    videoEnabled: boolean
    audioEnabled: boolean
    stream?: MediaStream
}

interface Stream {
    id: string
    producers: MediaSoup.Producer[]
    videoEnabled: boolean
    audioEnabled: boolean
}

export interface MuteNotification {
    roomId: string
    sessionId: string
    audio?: boolean
    video?: boolean
}

export interface GlobalMuteNotification {
    roomId: string
    audioGloballyMuted?: boolean,
    videoGloballyDisabled?: boolean,
}

function getVP9SvcScalabilityMode() {
    const useVP9 = process.env.USE_VP9 ? true : false
    if(!useVP9) {return}
    const defaultMode = process.env.VP9_DEFAULT_SVC_MODE || "L3T3_KEY_SHIFT"
    const getParameters = new URLSearchParams(window.location.search);
    const mode = getParameters.get("svc")
    switch(mode) {
        case "none":
            return
        case "L1T2":
        case "L1T2h":
        case "L1T3":
        case "L1T3h":
        case "L2T1":
        case "L2T1h":
        case "L2T1_KEY":
        case "L2T2":
        case "L2T2h":
        case "L2T2_KEY":
        case "L2T2_KEY_SHIFT":
        case "L2T3":
        case "L2T3h":
        case "L2T3_KEY":
        case "L2T3_KEY_SHIFT":
        case "L3T1":
        case "L3T1h":
        case "L3T1_KEY":
        case "L3T2":
        case "L3T2h":
        case "L3T2_KEY":
        case "L3T2_KEY_SHIFT":
        case "L3T3":
        case "L3T3h":
        case "L3T3_KEY":
        case "L3T3_KEY_SHIFT":
        case "S2T1":
        case "S2T1h":
        case "S2T2":
        case "S2T2h":
        case "S2T3":
        case "S2T3h":
        case "S3T1":
        case "S3T1h":
        case "S3T2":
        case "S3T2h":
        case "S3T3":
        case "S3T3h":
            console.log(`Using scalable video codec mode '${mode}'`)
            return mode
        case undefined:
        case null:
            console.log(`Unspecified video codec scalability mode defaulting to '${defaultMode}'`)
            return defaultMode
        default:
            console.log(`Unknown video codec scalability mode '${mode}' defaulting to '${defaultMode}'`)
            return defaultMode
    }
}