import {
    types as MediaSoup
} from "mediasoup";
import { Resolver } from "./resolver";
import { PubSub } from "apollo-server";
import { EventEmitter } from "events";

export interface Stream {
    id: string
    sessionId: string
    producers: MediaSoup.Producer[]
}

export class Client {
    public static async create(id: string, router: MediaSoup.Router, listenIps: MediaSoup.TransportListenIp[], closeCallback: () => unknown) {
        try {
            const producerTransport = await router.createWebRtcTransport({
                listenIps,
                enableTcp: true,
                enableUdp: true,
                preferUdp: true,
            })
            const consumerTransport = await router.createWebRtcTransport({
                listenIps,
                enableTcp: true,
                enableUdp: true,
                preferUdp: true,
            })
            return new Client(id, router, producerTransport, consumerTransport, closeCallback)
        } catch (e) {
            console.error(e)
            throw e
        }
    }

    public connect() {
        if (!this.timeout) { return }
        clearTimeout(this.timeout)
        this.timeout = undefined
    }

    public disconnect() {
        if (this.timeout) { clearTimeout(this.timeout) }
        this.timeout = setTimeout(() => {
            console.log(`User(${this.id}) has timed out`)
            this.close()
        }, 1000 * 60)
    }

    public subscribe() {
        setImmediate(() => {
            console.log("initial")
            this.channel.publish("initial", {
                media: {
                    rtpCapabilities: JSON.stringify(this.router.rtpCapabilities),
                    producerTransport: transportParams(this.producerTransport),
                    consumerTransport: transportParams(this.consumerTransport),
                }
            })
        })
        return this.channel.asyncIterator([
            "initial",
            "consumer",
            "stream",
            "close",
        ])
    }

    public getStreams() {
        return this.streams.values()
    }

    public async forwardStream(stream: Stream) {
        console.log(`forward Stream(${stream.sessionId}_${stream.id})(${stream.producers.length}) to Client(${this.id})`)
        const forwardPromises = stream.producers.map((p) => this.forward(p).catch((e) => console.error(e)))
        console.log(`forward Stream - wait`)
        await Promise.all(forwardPromises)
        const producerIds = stream.producers.map((p) => p.id)
        console.log(`Publish Stream(${stream.sessionId}_${stream.id})`, producerIds)
        this.channel.publish("stream", {
            media: {
                stream: {
                    id: stream.id,
                    sessionId: stream.sessionId,
                    producerIds,
                }
            }
        })
    }

    public async forward(producer: MediaSoup.Producer) {
        try {
            console.log(`forward rtp caps`)
            const rtpCapabilities = await this.rtpCapabilities()
            const producerParams = {
                producerId: producer.id,
                rtpCapabilities
            }
            console.log(`forward can consume`)
            if (!this.router.canConsume(producerParams)) {
                console.error(`Client(${this.id}) could not consume producer(${producer.kind},${producer.id})`, producer.consumableRtpParameters)
                return
            }
            console.log(`forward wait consumer`)
            const consumer = await this.consumerTransport.consume({
                ...producerParams,
                paused: true
            })
            this.destructors.set(consumer.id, () => consumer.close())
            this.consumers.set(consumer.id, consumer)
            consumer.on("transportclose", () => {
                this.consumers.delete(consumer.id)
                this.channel.publish("close", { media: { close: consumer.id } })

            })
            consumer.on("producerclose", () => {
                this.consumers.delete(consumer.id)
                this.channel.publish("close", { media: { close: consumer.id } })
            })

            this.channel.publish("consumer", {
                media: {
                    consumer: JSON.stringify({
                        id: consumer.id,
                        producerId: consumer.producerId,
                        kind: consumer.kind,
                        rtpParameters: consumer.rtpParameters,
                        appData: undefined
                    })
                }
            })
        } catch (e) {
            console.error(e)
        }
    }

    public async rtpCapabilitiesMessage(message: string) {
        const rtpCapabilities = JSON.parse(message)
        if (this._rtpCapabilities) { console.error("rtpCapabilities is already set... overiding") }
        const { resolver } = await this.rtpCapabilitiesPrePromise
        this._rtpCapabilities = rtpCapabilities
        console.log(`rtpCapabilities initialized`)
        resolver(rtpCapabilities)
        return true
    }

    public async transportMessage(producer: boolean, message: string) {
        console.log("transport")
        const params = JSON.parse(message)
        if (producer) {
            await this.producerTransport.connect(params)
        } else {
            await this.consumerTransport.connect(params)
        }
        return true
    }

    public async producerMessage(paramsMessage: string) {
        console.log("producer message")
        const params = JSON.parse(paramsMessage)
        const producer = await this.producerTransport.produce(params)
        this.destructors.set(producer.id, () => producer.close())
        producer.on("transportclose", () => {
            this.producers.delete(producer.id)
            this.channel.publish("close", { media: { close: producer.id } })
        })
        this.producers.set(producer.id, producer)
        console.log("producer message - ret")
        return producer.id
    }

    public consumerMessage(id: string, pause?: boolean) {
        console.log("consumer message")
        if (pause === undefined) { return }
        const consumer = this.consumers.get(id)
        if (!consumer) { console.error(`Unable to pause missing Consumer(${id})`); return; }
        if (pause) {
            consumer.pause()
        } else {
            consumer.resume()
        }
        return true
    }

    public streamMessage(id: string, producerIds: string[]) {
        console.log(`StreamMessage(${id}) to Client(${this.id}) contains ${producerIds.map((id) => `Producer(${id})`).join(" ")}`)
        const producers = []
        for (const producerId of producerIds) {
            const producer = this.producers.get(producerId)
            if (!producer) {
                console.error(`Client(${this.id}).Stream(${id}) could not locate Producer(${producerId})`)
                continue
            }
            producers.push(producer)
        }
        const stream = {
            id,
            sessionId: this.id,
            producers
        }
        this.streams.set(id, stream)
        console.log(`Emit Stream(${this.id}_${id})(${producers.length})`)
        this.emitter.emit("stream", stream)
        return true
    }
    public async closeMessage(id: string) {
        const destructor = this.destructors.get(id)
        if (!destructor) { console.error(`Client(${this.id}).Destructor(${id}) could not be found`); return; }
        destructor()
        return true
    }

    public emitter = new EventEmitter()
    private destructors = new Map<string, () => unknown>()
    private streams = new Map<string, Stream>()
    private producers = new Map<string, MediaSoup.Producer>()
    private consumers = new Map<string, MediaSoup.Consumer>()
    private channel = new PubSub()
    private id: string
    private router: MediaSoup.Router
    private producerTransport: MediaSoup.WebRtcTransport
    private consumerTransport: MediaSoup.WebRtcTransport
    private timeout?: NodeJS.Timeout
    private closeCallback: () => unknown

    private constructor(
        id: string,
        router: MediaSoup.Router,
        producerTransport: MediaSoup.WebRtcTransport,
        consumerTransport: MediaSoup.WebRtcTransport,
        closeCallback: () => unknown,
    ) {
        this.id = id
        this.router = router

        this.producerTransport = producerTransport
        producerTransport.on("routerclose", () => {
            this.channel.publish("close", { media: { close: producerTransport.id } })
        })
        this.destructors.set(producerTransport.id, () => producerTransport.close())

        this.consumerTransport = consumerTransport
        consumerTransport.on("routerclose", () => {
            this.channel.publish("close", { media: { close: consumerTransport.id } })
        })
        this.destructors.set(consumerTransport.id, () => consumerTransport.close())
        this.closeCallback = closeCallback
    }

    private async produce(produce: MediaSoup.ProducerOptions) {
        const producer = await this.consumerTransport.produce(produce)
        this.destructors.set(producer.id, () => producer.close())
        this.producers.set(producer.id, producer)
        return producer.id
    }

    private _rtpCapabilities?: MediaSoup.RtpCapabilities
    private rtpCapabilitiesPrePromise = Resolver<MediaSoup.RtpCapabilities>()
    private async rtpCapabilities() {
        if (this._rtpCapabilities) { return this._rtpCapabilities }
        const { promise } = await this.rtpCapabilitiesPrePromise
        return promise
    }

    private close() {
        console.log(`Client(${this.id}) cleanup`)
        this.closeCallback()
        for(const destructor of this.destructors.values()) {
            destructor()
        }
    }
}

function transportParams(transport: MediaSoup.WebRtcTransport) {
    return JSON.stringify({
        id: transport.id,
        iceParameters: transport.iceParameters,
        iceCandidates: transport.iceCandidates,
        dtlsParameters: transport.dtlsParameters,
        sctpParameters: transport.sctpParameters,
    })
}