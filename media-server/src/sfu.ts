import { v4 as uuid } from "uuid";
import {
    observer,
    createWorker,
    types as MediaSoup,
} from "mediasoup";
import { Client, Stream } from "./client";
import { Context, startServerTimeout } from "./entry";
import Redis = require("ioredis")
import { RedisKeys } from "./redisKeys";
import { setAvailable } from "./reporting";

export class SFU {
    public static async create(ip: string, uri: string): Promise<SFU> {
        const worker = await createWorker({
            logLevel: "warn",
        })
        console.log("🎥 Mediasoup worker initalized");
        const mediaCodecs: MediaSoup.RtpCodecCapability[] = [
            {
                kind: "audio",
                mimeType: "audio/opus",
                clockRate: 48000,
                channels: 2
            },
            {
                kind: "video",
                mimeType: "video/H264",
                clockRate: 90000,
                parameters:
                {
                    "packetization-mode": 1,
                    "profile-level-id": "42e01f",
                    "level-asymmetry-allowed": 1
                }
            }
        ];
        const router = await worker.createRouter({ mediaCodecs })
        console.log("💠 Mediasoup router created");

        const redis = new Redis({
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT) || undefined,
            password: process.env.REDIS_PASS || undefined,
            lazyConnect: true,
        });
        await redis.connect();
        console.log("🔴 Redis database connected");
        return new SFU(ip, uri, redis, worker, router)
    }


    public async subscribe({ sessionId }: Context) {
        if (!sessionId) { console.error("Can not initiate subscription without sessionId"); return }
        console.log(`Subscription from ${sessionId}`)
        const client = await this.getOrCreateClient(sessionId)
        return client.subscribe()
    }

    public async rtpCapabilitiesMessage(context: Context, rtpCapabilities: string) {
        console.log(`rtpCapabilitiesMessage from ${context.sessionId}`)
        if (!context.sessionId) { return false }
        const client = await this.getOrCreateClient(context.sessionId)
        return client.rtpCapabilitiesMessage(rtpCapabilities)
    }
    public async transportMessage(context: Context, producer: boolean, params: string) {
        console.log(`transportMessage(${producer}) from ${context.sessionId}`)
        if (!context.sessionId) { return false }
        const client = await this.getOrCreateClient(context.sessionId)
        return client.transportMessage(producer, params)
    }
    public async producerMessage(context: Context, params: string) {
        console.log(`producerMessage from ${context.sessionId}`)
        if (!context.sessionId) { return false }
        const client = await this.getOrCreateClient(context.sessionId)
        return client.producerMessage(params)
    }
    public async consumerMessage(context: Context, id: string, pause?: boolean) {
        console.log(`consumerMessage from ${context.sessionId}`)
        if (!context.sessionId) { return false }
        const client = await this.getOrCreateClient(context.sessionId)
        return client.consumerMessage(id, pause)
    }
    public async streamMessage(context: Context, id: string, producerIds: string[]) {
        console.log(`streamMessage from ${context.sessionId}`)
        if (!context.sessionId) { return false }
        const client = await this.getOrCreateClient(context.sessionId)
        return client.streamMessage(id, producerIds)
    }

    public async closeMessage(context: Context, id: string) {
        console.log(`closeMessage from ${context.sessionId}`)
        if (!context.sessionId) { return false }
        const client = await this.getOrCreateClient(context.sessionId)
        return client.closeMessage(id)
    }

    private readonly id = uuid();
    private readonly externalIp: string
    private readonly address: string
    private readonly listenIps: MediaSoup.TransportListenIp[]
    private clients = new Map<string, Client>()
    private roomId?: string
    private redis: Redis.Redis
    private worker: MediaSoup.Worker
    private router: MediaSoup.Router
    private constructor(ip: string, uri: string, redis: Redis.Redis, worker: MediaSoup.Worker, router: MediaSoup.Router) {
        this.externalIp = ip
        this.listenIps = [{ ip: "0.0.0.0", announcedIp: process.env.PUBLIC_ADDRESS || ip }]
        this.address = uri
        this.redis = redis
        this.worker = worker
        this.router = router
        this.claimRoom()
    }

    private async claimRoom() {
        let roomId: string
        let claimed: "OK" | null = null
        let sfu = { key: "", ttl: 0 }
        do {
            [, roomId] = await this.redis.blpop("sfu:request", 0)
            if (!roomId) { continue }
            sfu = RedisKeys.roomSfu(roomId)
            claimed = await this.redis.set(sfu.key, this.address, "EX", sfu.ttl, "NX")
        } while (claimed !== "OK")
        this.roomId = roomId
        setAvailable(false)

        console.log(`Assigned to Room(${roomId})`)
        startServerTimeout()
        const notify = RedisKeys.roomNotify(this.roomId);
        await this.redis.xadd(
            notify.key,
            "MAXLEN", "~", 32, "*",
            "json", JSON.stringify({ sfu: this.address })
        );

        let value: string | null
        do {
            await this.redis.set(sfu.key, this.address, "EX", sfu.ttl, "XX")
            await new Promise((resolve) => setTimeout(resolve, sfu.ttl / 2))
            value = await this.redis.get(sfu.key)
        } while (value === this.address)

        console.error(`Room(${roomId})::SFU was '${value}' but expected '${this.address}', terminating SFU`)
        process.exit(-2)
    }

    private async getOrCreateClient(id: string): Promise<Client> {
        let client = this.clients.get(id)
        if (!client) {
            client = await Client.create(id, this.router, this.listenIps)
            console.log(`New Client(${id})`)
            for (const [otherId, otherClient] of this.clients) {
                for (const stream of otherClient.getStreams()) {
                    client.forwardStream(stream).then(() => {
                        console.log(`Forwarding Stream(${stream.sessionId}_${stream.id}) from Client(${otherId}) to Client(${id})`)
                    })
                }
            }
            this.clients.set(id, client)
            client.emitter.on("stream", (s: Stream) => this.newStream(s))
        }
        return client
    }

    private async newStream(stream: Stream) {
        console.log(`New Stream(${stream.sessionId}_${stream.id})`)
        const forwardPromises = []
        for (const [id, client] of this.clients) {
            if (id === stream.sessionId) { continue }
            const forwardPromise = client.forwardStream(stream)
            forwardPromise.then(() => {
                console.log(`Forwarding new Stream(${stream.sessionId}_${stream.id}) to Client(${id})`)
            })
            forwardPromises.push(forwardPromise)
        }
        await Promise.all(forwardPromises)
    }
}

observer.on("newworker", (worker) => {
    console.log("new worker created [worke.pid:%d]", worker.pid);
    worker.observer.on("close", () => console.log("worker closed [worker.pid:%d]", worker.pid));
    worker.observer.on("newrouter", (router: MediaSoup.Router) => {
        console.log("new router created [worker.pid:%d, router.id:%s]", worker.pid, router.id);
        router.observer.on("close", () => console.log("router closed [router.id:%s]", router.id));
        router.observer.on("newtransport", (transport: MediaSoup.Transport) => {
            console.log("new transport created [worker.pid:%d, router.id:%s, transport.id:%s]", worker.pid, router.id, transport.id);
            transport.observer.on("close", () => console.log("transport closed [transport.id:%s]", transport.id));
            transport.observer.on("newproducer", (producer: MediaSoup.Producer) => {
                console.log("new producer created [worker.pid:%d, router.id:%s, transport.id:%s, producer.id:%s]", worker.pid, router.id, transport.id, producer.id);
                producer.observer.on("close", () => console.log("producer closed [producer.id:%s]", producer.id));
            });
            transport.observer.on("newconsumer", (consumer: MediaSoup.Consumer) => {
                console.log("new consumer created [worker.pid:%d, router.id:%s, transport.id:%s, consumer.id:%s]", worker.pid, router.id, transport.id, consumer.id);
                consumer.observer.on("close", () => console.log("consumer closed [consumer.id:%s]", consumer.id));
            });
            transport.observer.on("newdataproducer", (dataProducer: MediaSoup.DataProducer) => {
                console.log("new data producer created [worker.pid:%d, router.id:%s, transport.id:%s, dataProducer.id:%s]", worker.pid, router.id, transport.id, dataProducer.id);
                dataProducer.observer.on("close", () => console.log("data producer closed [dataProducer.id:%s]", dataProducer.id));
            });
            transport.observer.on("newdataconsumer", (dataConsumer: MediaSoup.DataConsumer) => {
                console.log("new data consumer created [worker.pid:%d, router.id:%s, transport.id:%s, dataConsumer.id:%s]", worker.pid, router.id, transport.id, dataConsumer.id);
                dataConsumer.observer.on("close", () => console.log("data consumer closed [dataConsumer.id:%s]", dataConsumer.id));
            });
        });
    });
});