// @ts-ignore
import { AuthTokenProvider } from "../services/auth-token/AuthTokenProvider";

const callstats: any = require('callstats-js/callstats.min');
import { WebRTCContext } from "./webrtc";
import {
    Device,
    types as MediaSoup,
} from "mediasoup-client"
import React, { createContext, useReducer, useRef, useContext, useEffect, useMemo } from "react";
import { RoomContext } from "../pages/room/room";
import { gql, ExecutionResult, ApolloClient, InMemoryCache } from "apollo-boost";
import { useMutation, useSubscription, ApolloProvider, useLazyQuery } from "@apollo/react-hooks";
import { MutationFunctionOptions } from "@apollo/react-common/lib/types/types";
import { Resolver, PrePromise } from "../resolver";
import { WebSocketLink } from "apollo-link-ws";
import { sessionId, LocalSessionContext } from "../entry";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Producer, ProducerOptions } from "mediasoup-client/lib/Producer";

export const GET_GLOBAL_MUTE = gql`
    query getGlobalMute($roomId: String!, $sessionId: String!) {
        getGlobalMute(roomId: $roomId, sessionId: $sessionId) {
            audioGloballyMuted,
            videoGloballyDisabled,
        }
    }
`;

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
const MUTE = gql`
    mutation mute($roomId: String!, $sessionId: String!, $audio: Boolean, $video: Boolean) {
        mute(roomId: $roomId, sessionId: $sessionId, audio: $audio, video: $video)
    }
`;
const GLOBAL_MUTE = gql`
    mutation globalMute($roomId: String!, $audioGloballyMuted: Boolean, $videoGloballyDisabled: Boolean) {
        globalMute(roomId: $roomId, audioGloballyMuted: $audioGloballyMuted, videoGloballyDisabled: $videoGloballyDisabled)
    }
`;
export const ENDCLASS = gql`
    mutation endClass($roomId: String) {
        endClass(roomId: $roomId)
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
            globalMute {
                roomId,
                audioGloballyMuted,
                videoGloballyDisabled,
            },
        }
    }
`;

const context = createContext<{ ref: React.MutableRefObject<WebRTCSFUContext> }>(undefined as any);

export class WebRTCSFUContext implements WebRTCContext {
    public static Provide({ children }: { children: JSX.Element[] | JSX.Element }) {
        const ref = useRef<WebRTCSFUContext>(undefined as any)
        const [value, rerender] = useReducer(() => ({ ref }), { ref })
        const { roomId } = RoomContext.Consume();
        const token = AuthTokenProvider.retrieveToken();

        const apolloClient = useMemo(() =>
            new ApolloClient({
                cache: new InMemoryCache(),
                link: new WebSocketLink({
                    uri: `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/sfu/${roomId}`,
                    options: {
                        reconnect: true,
                        connectionParams: { sessionId, authToken: token },
                    },
                })
            } as any),
            [roomId])

        if (!apolloClient) {
            return <CircularProgress />
        }

        return (
            <>
                <ApolloProvider client={apolloClient}>
                    <WebRTCSFUContext.InternalProvider sfu={ref} rerender={rerender} />
                </ApolloProvider>
                <context.Provider value={value}>
                    {children}
                </context.Provider>
            </>
        )
    }

    private static InternalProvider({ sfu, rerender }: { sfu: React.MutableRefObject<WebRTCSFUContext>, rerender: React.DispatchWithoutAction }) {
        const { roomId } = RoomContext.Consume();
        const { name, sessionId } = useContext(LocalSessionContext);
        const [rtpCapabilities] = useMutation(SEND_RTP_CAPABILITIES);
        const [transport] = useMutation(TRANSPORT);
        const [producer] = useMutation(PRODUCER);
        const [consumer] = useMutation(CONSUMER);
        const [stream] = useMutation(STREAM);
        const [mute] = useMutation(MUTE);
        const [globalMute] = useMutation(GLOBAL_MUTE);
        const [endClass] = useMutation(ENDCLASS);
        const [getGlobalMute] = useLazyQuery(GET_GLOBAL_MUTE, {onCompleted: data => sfu.current.globalMuteMessage(data.getGlobalMute)});
        useEffect(() => {
            if (sfu.current) {
                getGlobalMute({variables: { roomId, sessionId}});
            }
        }, [getGlobalMute, roomId, sessionId, sfu.current]);

        if (!sfu.current) {
            sfu.current = new WebRTCSFUContext(rerender, rtpCapabilities, transport, producer, consumer, stream, mute, globalMute, endClass)
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
                    sfu.current.rtpCapabilitiesMessage(rtpCapabilities)
                }
                if (producerTransport) {
                    sfu.current.producerTransportMessage(producerTransport, roomId)
                }
                if (consumerTransport) {
                    sfu.current.consumerTransportMessage(consumerTransport, roomId)
                }
                if (consumer) {
                    sfu.current.consumerMessage(consumer)
                }
                if (stream) {
                    sfu.current.streamMessage(stream)
                }
                if (close) {
                    sfu.current.closeMessage(close)
                }
                if (mute) {
                    sfu.current.muteMessage(mute)
                }
                if (globalMute) {
                    sfu.current.globalMuteMessage(globalMute)
                }
            },
            variables: { roomId }
        })

        const { camera } = useContext(LocalSessionContext);

        useEffect(() => {
            callstats.initialize("881714000", "OV6YSSRJ0fOA:vr7quqij46jLPMpaBXTAF50F2wFTqP4acrxXWVs9BIk=", name + ":" + sessionId)
        }, [name, sessionId])


        useEffect(() => {
            if (!camera) {
                return
            }
            const promise = sfu.current.transmitStream("camera", camera)
            return () => {
                promise.then((producers) => producers.forEach(producer => {
                    if (producer) {
                        producer.close()
                    }
                }))
            }
        }, [camera])

        return <></>
    }

    public static Consume() {
        return useContext(context).ref.current
    }

    public getCameraStream(sessionId: string) {
        return this.getStream(`${sessionId}_camera`)
    }

    public getAuxStream(sessionId: string) {
        return this.getStream(`${sessionId}_aux`)
    }

    public getOutboundCameraStream() {
        return this.outboundStreams.get("camera")
    }

    private getStream(id: string) {
        const stream = this.inboundStreams.get(id)
        if (!stream) {
            return
        }
        return stream.stream
    }

    private getTracks(id: string) {
        const stream = this.inboundStreams.get(id)
        console.log(this.inboundStreams)
        console.log(`stream - ${id}`, stream)
        if (!stream) {
            return
        }
        const tracks = stream.producerIds
            .map((producerId) => this.tracks.get(producerId))
            .filter((track) => track !== undefined) as MediaStreamTrack[]
        return tracks
    }

    public getAllInboundTracks() {
        return this.inboundStreams.values()
    }

    public async transmitStream(id: string, stream: MediaStream, simulcast = true) {
        console.log(`Transmit ${id}`)
        const transport = await this.producerTransport()
        console.log(`Transport`)
        const tracks = stream.getTracks()
        const producers = []
        let producer: Producer
        for (const track of tracks) {
            const params = {track} as ProducerOptions
            if (track.kind === "video") {
                const scalabilityMode = getSvcScalabilityMode()
                const codecs = (await this.device()).rtpCapabilities?.codecs
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
            this.destructors.set(producer.id, () => producer.close())
            producers.push(producer)
        }
        console.log(`Got producers`)
        console.log(producers)
        this.outboundStreams.set(id, {
            id,
            producers,
            audioEnabled: true,
            videoEnabled: true,
        })
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
        const { errors } = await this.stream({ variables: { id, producerIds } })
        if (errors) {
            throw errors
        }
        console.log(`Got stream`)
        return producers
    }

    public async sendMute(muteNotification: MuteNotification) {
        console.log(`${JSON.stringify(muteNotification)}`)
        await this.mute({ variables: muteNotification })
    }

    public async sendGlobalMute(globalMuteNotification: GlobalMuteNotification) {
        console.log(`${JSON.stringify(globalMuteNotification)}`)
        await this.globalMute({ variables: globalMuteNotification })
    }

    public localAudioToggle(id?: string) {
        return this.localAudioEnable(id)
    }

    public isLocalAudioEnabled(id?: string) {
        const stream = id === undefined || id === sessionId
            ? this.outboundStreams.get("camera")
            : this.inboundStreams.get(`${id}_camera`)
        if (!stream) {
            return false
        }
        return stream.audioEnabled
    }

    public localAudioEnable(id?: string, enabled?: boolean) {
        if (id === undefined || id === sessionId) {
            // My Camera
            const stream = this.outboundStreams.get("camera")
            if (!stream) {
                return
            }
            if (enabled === undefined) {
                enabled = !stream.audioEnabled
            }
            if (stream.audioEnabled !== enabled) {
                stream.audioEnabled = enabled
                this.rerender()
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
            const tracks = this.getTracks(`${id}_camera`)
            if (!tracks) {
                return
            }
            const stream = this.inboundStreams.get(`${id}_camera`)
            if (!stream) {
                return
            }
            if (enabled === undefined) {
                enabled = !stream.audioEnabled
            }
            if (stream.audioEnabled !== enabled) {
                stream.audioEnabled = enabled
                this.rerender()
            }

            for (const track of tracks) {
                if (track.kind === "audio") {
                    track.enabled = stream.audioEnabled
                }
            }
        }
    }


    public localVideoToggle(id?: string) {
        return this.localVideoEnable(id)
    }

    public isLocalVideoEnabled(id?: string) {
        const stream = id === undefined || id === sessionId
            ? this.outboundStreams.get("camera")
            : this.inboundStreams.get(`${id}_camera`)
        if (!stream) {
            return false
        }
        return stream.videoEnabled
    }

    public localVideoEnable(id?: string, enabled?: boolean) {
        if (id === undefined || id === sessionId) {
            // My Camera
            const stream = this.outboundStreams.get("camera")
            console.log("stream", stream, this.outboundStreams)
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
                this.rerender()
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
            const tracks = this.getTracks(`${id}_camera`)
            console.log("tracks", tracks)
            if (!tracks) {
                return
            }
            const stream = this.inboundStreams.get(`${id}_camera`)
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
                this.rerender()
            }

            for (const track of tracks) {
                console.log("track", track)
                if (track.kind === "video") {
                    track.enabled = stream.videoEnabled
                }
            }
        }
    }

    private tracks = new Map<string, MediaStreamTrack>()
    private consumers = new Map<string, MediaSoup.Consumer>()
    private inboundStreams = new Map<string, StreamDescription>()
    private outboundStreams = new Map<string, Stream>()
    private destructors = new Map<string, () => unknown>()
    private rerender: React.DispatchWithoutAction
    private _audioGloballyMuted: boolean = false;
    private _videoGloballyDisabled: boolean = false;

    private constructor(
        rerender: React.DispatchWithoutAction,
        private rtpCapabilities: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>,
        private transport: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>,
        private producer: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>,
        private consumer: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>,
        private stream: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>,
        private mute: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>,
        private globalMute: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>,
        private endClass: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>,
    ) {
        this.rerender = rerender
        this.rtpCapabilities = rtpCapabilities
        this.transport = transport
        this.producer = producer
        this.consumer = consumer
        this.stream = stream
        this.mute = mute
        this.globalMute = globalMute
        this.endClass = endClass
    }

    private _device?: Device | null
    private devicePrePromise = Resolver<Device>()

    private async device() {
        if (this._device) {
            return this._device
        }
        const { promise } = await this.devicePrePromise
        return promise
    }

    private _producerTransport?: MediaSoup.Transport | null
    private producerPrePromise = Resolver<MediaSoup.Transport>()

    private async producerTransport() {
        if (this._producerTransport) {
            return this._producerTransport
        }
        const { promise } = await this.producerPrePromise
        return promise
    }

    private _consumerTransport?: MediaSoup.Transport | null
    private consumerTransportPrePromise = Resolver<MediaSoup.Transport>()

    private async consumerTransport() {
        if (this._consumerTransport) {
            return this._consumerTransport
        }
        const { promise } = await this.consumerTransportPrePromise
        return promise
    }

    private consumerPrePromises = new Map<string, PrePromise<MediaSoup.Consumer>>()

    private async getConsumer(producerId: string) {
        let consumer = this.consumers.get(producerId)
        if (consumer) {
            return consumer
        }
        let prePromise = this.consumerPrePromises.get(producerId)
        if (!prePromise) {
            prePromise = Resolver<MediaSoup.Consumer>()
            this.consumerPrePromises.set(producerId, prePromise)
        }
        const { promise } = await prePromise
        return promise
    }

    private async rtpCapabilitiesMessage(message: string) {

        const routerRtpCapabilities = JSON.parse(message)
        if (this._device) {
            console.error("WebRTC device already initialized");
            return;
        }
        if (this._device === null) {
            console.error("WebRTC device is being initialized");
            return;
        }
        this._device = null

        const device = new Device()
        await device.load({ routerRtpCapabilities })
        const rtpCapabilities = JSON.stringify(device.rtpCapabilities)
        await this.rtpCapabilities({ variables: { rtpCapabilities } })
        const { resolver } = await this.devicePrePromise

        this._device = device
        resolver(this._device)
    }

    private async producerTransportMessage(message: string, roomId: string) {
        const params = JSON.parse(message)
        if (this._producerTransport) {
            console.error("Producer transport already initialized");
            return;
        }
        if (this._producerTransport === null) {
            console.error("Producer transport is being initialized");
            return;
        }
        this._producerTransport = null

        console.log("Producer: wait device")
        const device = await this.device()
        console.log("Producer: wait send transport", params)
        const transport = await device.createSendTransport(params)

        WebRTCSFUContext.attachCallstatsFabric(transport, params, roomId, callstats.transmissionDirection.sendonly)

        this.destructors.set(transport.id, () => {
            WebRTCSFUContext.terminateCallstatsFabric(transport, roomId)
            transport.close()
        })

        transport.on("connect", async (connectParams, callback, errback) => {
            try {
                const { errors } = await this.transport({
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
                WebRTCSFUContext.attachCallstatsError(transport, roomId, error)
                errback(error)
            }
        })
        transport.on("produce", async (produceParams, callback, errback) => {
            try {
                const params = JSON.stringify(
                    Object.assign({ transportId: transport.id }, produceParams)
                )
                const { data, errors } = await this.producer({
                    variables: { params },
                })
                if (errors) {
                    throw errors
                }
                callback({ id: data.producer })
            } catch (error) {
                WebRTCSFUContext.attachCallstatsError(transport, roomId, error)
                errback(error)
            }
        }
        )

        console.log("Producer: resolve")
        const { resolver } = await this.producerPrePromise
        this._producerTransport = transport
        resolver(this._producerTransport)
        console.log("Producer: resolved")
    }

    private async consumerTransportMessage(message: string, roomId: string) {
        const params = JSON.parse(message)
        if (this._consumerTransport) {
            console.error("Consumer transport already initialized");
            return;
        }
        if (this._consumerTransport === null) {
            console.error("Consumer transport is being initialized");
            return;
        }
        this._consumerTransport = null

        console.log("Consumer: wait device")
        const device = await this.device()
        console.log("Consumer: create recv transport")
        const transport = await device.createRecvTransport(params)

        WebRTCSFUContext.attachCallstatsFabric(transport, params, roomId, callstats.transmissionDirection.receiveonly);

        this.destructors.set(transport.id, () => {
            WebRTCSFUContext.terminateCallstatsFabric(transport, roomId)
            transport.close()
        })

        transport.on("connect", async (connectParams, callback, errback) => {
            console.log("Consumer: connect")
            try {
                const { errors } = await this.transport({
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
                WebRTCSFUContext.attachCallstatsError(transport, roomId, error)
                errback(error)
            }
        })

        console.log("Consumer: resolve")
        const { resolver } = await this.consumerTransportPrePromise
        this._consumerTransport = transport
        resolver(this._consumerTransport)
    }

    private static attachCallstatsFabric(transport: MediaSoup.Transport, params: any, roomId: string, direction: any) {
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

    private static attachCallstatsError(transport: MediaSoup.Transport, roomId: string, err: any) {
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

    private static terminateCallstatsFabric(transport: MediaSoup.Transport, roomId: string) {
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

    private async consumerMessage(consumerParams: string) {
        console.log("Consumer message")
        const params = JSON.parse(consumerParams)

        const device = await this.device()
        const transport = await this.consumerTransport()
        console.log("Consumer wait")
        const consumer = await transport.consume(params)
        this.destructors.set(consumer.id, () => consumer.close())
        console.log("Consumer unpause")
        this.consumer({ variables: { id: consumer.id, pause: false } })
        this.tracks.set(consumer.producerId, consumer.track)
        this.consumers.set(consumer.producerId, consumer)
        let prePromise = this.consumerPrePromises.get(consumer.producerId)
        if (prePromise) {
            const { resolver } = await prePromise
            resolver(consumer)
        }
        console.log("Consumer done")
    }

    private async streamMessage(stream: StreamDescription) {
        console.log("streamMessage", stream)
        const {
            id,
            sessionId,
            producerIds
        } = stream
        Object.assign(stream, { videoEnabled: true, audioEnabled: true })
        this.inboundStreams.set(`${sessionId}_${id}`, stream)
        const tracks = [] as MediaStreamTrack[]
        for (const producerId of producerIds) {
            const consumer = await this.getConsumer(producerId)
            tracks.push(consumer.track)
        }
        stream.stream = new MediaStream(tracks)
        this.rerender()
    }

    private async muteMessage(muteNotification: MuteNotification) {
        console.log("muteMessage", muteNotification)
        const {
            audio,
            video
        } = muteNotification

        const stream = this.inboundStreams.get(`${muteNotification.sessionId}_camera`)
        if (stream) {
            if (audio && !this.isLocalAudioEnabled(muteNotification.sessionId)) {
                this.localAudioToggle(muteNotification.sessionId)
            } else if (audio === false && this.isLocalAudioEnabled(muteNotification.sessionId)) {
                this.localAudioToggle(muteNotification.sessionId)
            }
            if (video && !this.isLocalVideoEnabled(muteNotification.sessionId)) {
                this.localVideoToggle(muteNotification.sessionId)
            } else if (video === false && this.isLocalVideoEnabled(muteNotification.sessionId)) {
                this.localVideoToggle(muteNotification.sessionId)
            }
        } else if (sessionId === muteNotification.sessionId) {
            if (audio && !this.isLocalAudioEnabled()) {
                this.localAudioToggle()
            } else if (audio === false && this.isLocalAudioEnabled()) {
                this.localAudioToggle()
            }
            if (video && !this.isLocalVideoEnabled()) {
                this.localVideoToggle()
            } else if (video === false && this.isLocalVideoEnabled()) {
                this.localVideoToggle()
            }
        }
    }

    private globalMuteMessage(globalMuteNotification: GlobalMuteNotification): void {
        this._audioGloballyMuted = globalMuteNotification.audioGloballyMuted ?? this._audioGloballyMuted;
        this._videoGloballyDisabled = globalMuteNotification.videoGloballyDisabled ?? this._videoGloballyDisabled;
    }

    get audioGloballyMuted(): boolean {
        return this._audioGloballyMuted;
    }

    get videoGloballyDisabled(): boolean {
        return this._videoGloballyDisabled;
    }

    private async closeMessage(id: string) {
        const destructor = this.destructors.get(id)
        if (!destructor) {
            return
        }
        this.destructors.delete(id)
        destructor()
    }
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
function getSvcScalabilityMode() {
    const defaultMode = "L3T3_KEY_SHIFT"
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