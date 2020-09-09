import { WebRTCContext } from "./webrtc";
import {
    Device,
    types as MediaSoup,
} from "mediasoup-client"
import React,{ createContext, useReducer, useRef, useContext, useEffect, useMemo } from "react";
import { RoomContext } from "../room";
import { gql, ExecutionResult, ApolloClient, InMemoryCache } from "apollo-boost";
import { useMutation, useSubscription, ApolloProvider } from "@apollo/react-hooks";
import {  MutationFunctionOptions } from "@apollo/react-common/lib/types/types";
import { Resolver, PrePromise } from "../resolver";
import { WebSocketLink } from "apollo-link-ws";
import { sessionId, UserContext } from "../entry";
import CircularProgress from "@material-ui/core/CircularProgress";
import {Producer, ProducerOptions} from "mediasoup-client/lib/Producer";




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
            }
        }
    }
`;



const context = createContext<{ref: React.MutableRefObject<WebRTCSFUContext>}>(undefined as any);

export class WebRTCSFUContext implements WebRTCContext {
    public static Provide({children}: {children: JSX.Element[] | JSX.Element}) {
        const ref = useRef<WebRTCSFUContext>(undefined as any)
        const [value, rerender] = useReducer(() => ({ref}),{ref})
        const { roomId } = RoomContext.Consume();
        
        const apolloClient = useMemo(() =>
            new ApolloClient({
                cache: new InMemoryCache(),
                link: new WebSocketLink({
                    uri: `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/sfu/${roomId}`,
                    options: {
                        reconnect: true,
                        connectionParams: { sessionId },
                    },
                })
            } as any),
        [roomId])

        if(!apolloClient) { return <CircularProgress /> }

        return (
            <>
                <ApolloProvider client={apolloClient}>
                    <WebRTCSFUContext.InternalProvider sfu={ref} rerender={rerender}/>
                </ApolloProvider>
                <context.Provider value={value} >
                    {children}
                </context.Provider>
            </>
        )
    }
    private static InternalProvider({sfu, rerender}: {sfu: React.MutableRefObject<WebRTCSFUContext>, rerender: React.DispatchWithoutAction}) {
        const [rtpCapabilities] = useMutation(SEND_RTP_CAPABILITIES);
        const [transport] = useMutation(TRANSPORT);
        const [producer] = useMutation(PRODUCER);
        const [consumer] = useMutation(CONSUMER);
        const [stream] = useMutation(STREAM);
        if(!sfu.current) { sfu.current = new WebRTCSFUContext(rerender,rtpCapabilities,transport,producer,consumer,stream) }
        
        const { roomId } = RoomContext.Consume();
        useSubscription(SUBSCRIBE, {
            onSubscriptionData: ({ subscriptionData }) => {
                if (!subscriptionData) { return; }
                if (!subscriptionData.data) { return; }
                if (!subscriptionData.data.media) { return; }
                const {
                    rtpCapabilities,
                    producerTransport,
                    consumerTransport,
                    consumer,
                    stream,
                    close,
                } = subscriptionData.data.media
                if(rtpCapabilities) { sfu.current.rtpCapabilitiesMessage(rtpCapabilities) }
                if(producerTransport) { sfu.current.producerTransportMessage(producerTransport) }
                if(consumerTransport) { sfu.current.consumerTransportMessage(consumerTransport) }
                if(consumer) { sfu.current.consumerMessage(consumer) }
                if(stream) { sfu.current.streamMessage(stream) }
                if(close) { sfu.current.closeMessage(close) }
            },
            variables: { roomId }
        })
        

        const { camera } = useContext(UserContext);
        useEffect(() => {
            if(!camera) { return }
            const promise = sfu.current.transmitStream("camera", camera)
            return () => {
                promise.then((producers) => producers.forEach(producer => {
                    if(producer) { producer.close() }
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

    private getStream(id: string) {
        const stream = this.inboundStreams.get(id)
        if(!stream) { return }
        return stream.stream
    }

    private getTracks(id: string) {
        const stream = this.inboundStreams.get(id)
        console.log(this.inboundStreams)
        console.log(`stream - ${id}`, stream)
        if(!stream) { return }
        const tracks = stream.producerIds
            .map((producerId) => this.tracks.get(producerId))
            .filter((track) => track !== undefined) as MediaStreamTrack[]
        return tracks
    }

    public getAllInboundTracks() {
        return this.inboundStreams.values()
    }

    public async transmitStream(id: string, stream: MediaStream) {
        console.log(`Transmit ${id}`)
        const transport = await this.producerTransport()
        console.log(`Transport`)
        const tracks = stream.getTracks()
        const producers = []
        let producer: Producer
        for(const track of tracks) {
            console.log(`Wait for producer`)
            let params: ProducerOptions
            if (track.kind === "video") {
                params = {
                    track,
                    encodings: [
                        { ssrc: 111110, maxBitrate: 2000000, scaleResolutionDownBy: 4, scalabilityMode: 'S1T1' },
                        { ssrc: 111111, maxBitrate: 4000000, scaleResolutionDownBy: 2, scalabilityMode: 'S1T1' },
                        { ssrc: 111112, maxBitrate: 6000000, scaleResolutionDownBy: 1, scalabilityMode: 'S1T1' },
                    ]
                }
                producer  = await transport.produce(params)
                await producer.setMaxSpatialLayer(2)
            } else {
                params = { track }
                producer  = await transport.produce(params)
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
        for(const producer of producers) {
            if(producer) {producerIds.push(producer.id)}
        }
        if(producers.length === 0) {throw new Error("No producers")}
        console.log(`Stream()(${producerIds})`)
        const {errors} = await this.stream({variables: {id,producerIds}})
        if(errors) {throw errors}
        console.log(`Got stream`)
        return producers
    }

    public localAudioToggle(id?: string) { return this.localAudioEnable(id) }

    public isLocalAudioEnabled(id?: string) {
        const stream = id === undefined || id === sessionId
            ? this.outboundStreams.get("camera")
            : this.inboundStreams.get(`${id}_camera`)
        if(!stream) { return }
        return stream.audioEnabled
    }

    public localAudioEnable(id?: string, enabled?: boolean) {
        if(id === undefined || id === sessionId) {
            // My Camera
            const stream = this.outboundStreams.get("camera")
            if(!stream) { return }
            if(enabled === undefined) { enabled = !stream.audioEnabled }
            if(stream.audioEnabled !== enabled) {
                stream.audioEnabled = enabled
                this.rerender()
            }

            for (const producer of stream.producers) {
                if(producer.kind === "audio" && stream.audioEnabled === producer.paused) {
                    if(stream.audioEnabled) {
                        producer.resume()
                    } else {
                        producer.pause()
                    }
                }
            }       
        } else {
            // Other Camera
            const tracks = this.getTracks(`${id}_camera`)
            if(!tracks) { return }
            const stream = this.inboundStreams.get(`${id}_camera`)
            if(!stream) { return }
            if(enabled === undefined) { enabled = !stream.audioEnabled }
            if(stream.audioEnabled !== enabled) {
                stream.audioEnabled = enabled
                this.rerender()
            }

            for (const track of tracks) {
                if(track.kind === "audio") { track.enabled = stream.audioEnabled }
            }
        }
    }


    public localVideoToggle(id?: string) { return this.localVideoEnable(id) }

    public isLocalVideoEnabled(id?: string) {
        const stream = id === undefined || id === sessionId
            ? this.outboundStreams.get("camera")
            : this.inboundStreams.get(`${id}_camera`)
        if(!stream) { return }
        return stream.videoEnabled
    }

    public localVideoEnable(id?: string, enabled?: boolean) {
        if(id === undefined || id === sessionId) {
            // My Camera
            const stream = this.outboundStreams.get("camera")
            console.log("stream", stream, this.outboundStreams)
            if(!stream) { return }
            console.log("enabled", enabled)
            if(enabled === undefined) { enabled = !stream.videoEnabled }
            console.log("videoEnabled", stream.videoEnabled)
            if(stream.videoEnabled !== enabled) {
                stream.videoEnabled = enabled
                this.rerender()
            }

            for (const producer of stream.producers) {
                console.log("producer", producer.kind, producer.track, producer.paused)
                if(producer.kind === "video" && stream.videoEnabled === producer.paused) {
                    if(stream.videoEnabled) {
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
            if(!tracks) { return }
            const stream = this.inboundStreams.get(`${id}_camera`)
            console.log("stream", stream)
            if(!stream) { return }
            if(enabled === undefined) { enabled = !stream.videoEnabled }
            console.log("enabled", enabled)
            if(stream.videoEnabled !== enabled) {
                console.log("videoEnabled", stream.videoEnabled)
                stream.videoEnabled = enabled
                this.rerender()
            }

            for (const track of tracks) {
                console.log("track", track)
                if(track.kind === "video") { track.enabled = stream.videoEnabled }
            }
        }
    }

    private tracks = new Map<string,MediaStreamTrack>()
    private consumers = new Map<string,MediaSoup.Consumer>()
    private inboundStreams = new Map<string,StreamDescription>()
    private outboundStreams = new Map<string,Stream>()
    private destructors = new Map<string,()=>unknown>()
    private rerender: React.DispatchWithoutAction
    private rtpCapabilities: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>
    private transport: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>
    private producer: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>
    private consumer: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>
    private stream: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>
    private constructor(
        rerender: React.DispatchWithoutAction,
        rtpCapabilities: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>,
        transport: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>,
        producer: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>,
        consumer: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>,
        stream: (options?: MutationFunctionOptions<any, Record<string, any>>) => Promise<ExecutionResult<any>>,
    ) {
        this.rerender = rerender
        this.rtpCapabilities = rtpCapabilities
        this.transport = transport
        this.producer = producer
        this.consumer = consumer
        this.stream = stream
    }

    private _device?: Device | null
    private devicePrePromise = Resolver<Device>() 
    private async device() {
        if(this._device) {return this._device}
        const { promise } = await this.devicePrePromise
        return promise
    }

    private _producerTransport?: MediaSoup.Transport | null
    private producerPrePromise = Resolver<MediaSoup.Transport>() 
    private async producerTransport() {
        if(this._producerTransport) {return this._producerTransport}
        const { promise } = await this.producerPrePromise
        return promise
    }

    private _consumerTransport?: MediaSoup.Transport | null
    private consumerTransportPrePromise = Resolver<MediaSoup.Transport>() 
    private async consumerTransport() {
        if(this._consumerTransport) {return this._consumerTransport}
        const {promise} = await this.consumerTransportPrePromise
        return promise
    }

    private consumerPrePromises = new Map<string,PrePromise<MediaSoup.Consumer>>()
    private async getConsumer(producerId: string) {
        let consumer = this.consumers.get(producerId)
        if(consumer) { return consumer }
        let prePromise =  this.consumerPrePromises.get(producerId)
        if(!prePromise) {
            prePromise = Resolver<MediaSoup.Consumer>()
            this.consumerPrePromises.set(producerId, prePromise)
        }
        const {promise} = await prePromise
        return promise
    }

    private async rtpCapabilitiesMessage(message: string) {
                
        const routerRtpCapabilities = JSON.parse(message)
        if(this._device) {console.error("WebRTC device already initialized"); return;}
        if(this._device === null) {console.error("WebRTC device is being initialized"); return;}
        this._device = null
        
        const device = new Device()
        await device.load({routerRtpCapabilities})
        const rtpCapabilities = JSON.stringify(device.rtpCapabilities)
        await this.rtpCapabilities({variables: {rtpCapabilities}})
        const {resolver} = await this.devicePrePromise
        
        this._device = device
        resolver(this._device)
    }

    private async producerTransportMessage(message: string) {
        const params = JSON.parse(message)
        if(this._producerTransport) {console.error("Producer transport already initialized"); return;}
        if(this._producerTransport === null) {console.error("Producer transport is being initialized"); return;}
        this._producerTransport = null

        console.log("Producer: wait device")
        const device = await this.device()
        console.log("Producer: wait send transport", params)
        const transport = await device.createSendTransport(params)
        this.destructors.set(transport.id, () => transport.close())
        transport.on("connect", async (connectParams, callback, errback) => {
            try {                
                const { errors } = await this.transport({
                    variables: {
                        producer: true,
                        params: JSON.stringify(connectParams),
                    },
                })
                if(errors) { throw errors }
                callback()
            } catch (error) {
                errback(error)
            }
        })
        transport.on("produce", async (produceParams, callback, errback) => {
                try {
                    const params = JSON.stringify(
                        Object.assign({transportId: transport.id}, produceParams)
                    )
                    const {data, errors} = await this.producer({
                        variables: { params },
                    })
                    if(errors) { throw errors }
                    callback({ id: data.producer })
                } catch (error) {
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
    
    private async consumerTransportMessage(message: string) {
        const params = JSON.parse(message)
        if(this._consumerTransport) {console.error("Consumer transport already initialized"); return;}
        if(this._consumerTransport === null) {console.error("Consumer transport is being initialized"); return;}
        this._consumerTransport = null
        
        console.log("Consumer: wait device")
        const device = await this.device()
        console.log("Consumer: create recv transport")
        const transport = await device.createRecvTransport(params)
        this.destructors.set(transport.id, () => transport.close())
        transport.on("connect", async (connectParams, callback, errback) => {
            console.log("Consumer: connect")
            try {
                const { errors } = await this.transport({
                    variables: {
                        producer: false,
                        params: JSON.stringify(connectParams),
                    },
                })
                if(errors) { throw errors }
                callback()
            } catch (error) {
                errback(error)
            }
        })

        console.log("Consumer: resolve")
        const { resolver } = await this.consumerTransportPrePromise
        this._consumerTransport = transport
        resolver(this._consumerTransport)
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
        if(prePromise) {
            const {resolver} = await prePromise
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

    private async closeMessage(id: string) {
        const destructor = this.destructors.get(id)
        if(!destructor) { return }
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