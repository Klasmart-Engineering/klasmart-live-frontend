import { ApolloServer } from "apollo-server";
import { SFU } from "./sfu"
import { schema } from "./schema";
import { getNetworkInterfaceInfo } from "./networkInterfaces";
import { NetworkInterfaceInfo } from "os";
import fetch from "node-fetch"
import EC2 from "aws-sdk/clients/ec2"
import ECS from "aws-sdk/clients/ecs"
// @ts-ignore
import checkIp = require("check-ip")
import { setDockerId, setAvailable, setGraphQLConnections, setClusterId } from "./reporting";


export interface Context {
    roomId?: string,
    sessionId?: string
}

const ECSClient = new ECS()
const EC2Client = new EC2()

async function getECSTaskENIPublicIP() {
    const ecsMetadataURI = process.env.ECS_CONTAINER_METADATA_URI_V4 || process.env.ECS_CONTAINER_METADATA_URI
    if (!ecsMetadataURI) { return }
    console.log(ecsMetadataURI)
    const response = await fetch(`${ecsMetadataURI}`)
    const ecsMetadata = await response.json()
    setDockerId(ecsMetadata.DockerId)
    const clusterARN = ecsMetadata.Labels && ecsMetadata.Labels["com.amazonaws.ecs.cluster"] as string
    setClusterId(clusterARN)
    const taskARN = ecsMetadata.Labels && ecsMetadata.Labels["com.amazonaws.ecs.task-arn"] as string
    if (!taskARN) { return }
    const tasks = await ECSClient.describeTasks({ cluster: clusterARN, tasks: [taskARN] }).promise()
    if (!tasks.tasks) { return }
    for (const task of tasks.tasks) {
        if (!task.attachments) { continue }
        for (const attachment of task.attachments) {
            if (attachment.type !== "ElasticNetworkInterface") { continue }
            if (attachment.status === "DELETED") { continue }
            if (!attachment.details) { continue }
            for (const detail of attachment.details) {
                if (detail.name !== "networkInterfaceId") { continue }
                if (!detail.value) { continue }
                const enis = await EC2Client.describeNetworkInterfaces({ NetworkInterfaceIds: [detail.value] }).promise()
                if (!enis.NetworkInterfaces) { continue }
                for (const eni of enis.NetworkInterfaces) {
                    if (!eni.Association) { continue }
                    if (!eni.Association.PublicIp) { continue }
                    return eni.Association.PublicIp
                }
            }
        }
    }
}

function getIPAddress() {
    //Sort network interfaces to prioritize external and IPv4 addresses
    function scoreInterface(info: NetworkInterfaceInfo) {
        const check: any = checkIp(info.address)
        let score = 0
        if (check.isPublic) { score += 4 }
        if (!info.internal) { score += 2 }
        if (info.family === "IPv4") { score += 1 }
        return score
    }
    const interfaces = getNetworkInterfaceInfo()
    interfaces.sort((a, b) => scoreInterface(b) - scoreInterface(a))
    console.log(interfaces)
    if (interfaces.length <= 0) { return }
    return interfaces[0].address
}


export const connectionCount = new Map<string,number>()
async function main() {
    try {
        const port = process.env.PORT || 8000 + Math.floor(128 * Math.random());
        const ip = (await getECSTaskENIPublicIP()) || getIPAddress()
        if (!ip) { console.error("No network interface found"); process.exit(-4) }
        console.log("ip address", ip)
        const uri = `${ip}:${port}/graphql`
        const sfu = await SFU.create(ip, uri)
        let connectionCount = 0

        const server = new ApolloServer({
            typeDefs: schema,
            subscriptions: {
                keepAlive: 1000,
                onConnect: async ({ roomId, sessionId }: any, _webSocket, connectionData: any) => {
                    connectionCount++
                    setGraphQLConnections(connectionCount)
                    stopServerTimeout()
                    console.log(`Connection(${connectionCount}) from ${sessionId}`)
                    connectionData.counted = true
                    connectionData.sessionId = sessionId;
                    connectionData.roomId = roomId;
                    return { roomId, sessionId } as Context;
                },
                onDisconnect: (websocket, connectionData) => {
                    if (!(connectionData as any).counted) { return }
                    connectionCount--
                    setGraphQLConnections(connectionCount)
                    if (connectionCount <= 0) { startServerTimeout() }
                    const { sessionId } = connectionData as any
                    console.log(`Disconnection(${connectionCount}) from ${sessionId}`)
                }
            },
            resolvers: {
                Query: {
                    ready: () => true,
                },
                Mutation: {
                    rtpCapabilities: (_parent, { rtpCapabilities }, context: Context) => sfu.rtpCapabilitiesMessage(context, rtpCapabilities),
                    transport: (_parent, { producer, params }, context: Context) => sfu.transportMessage(context, producer, params),
                    producer: (_parent, { params }, context: Context) => sfu.producerMessage(context, params),
                    consumer: (_parent, { id, pause }, context: Context) => sfu.consumerMessage(context, id, pause),
                    stream: (_parent, { id, producerIds }, context: Context) => sfu.streamMessage(context, id, producerIds),
                    close: (_parent, { id }, context: Context) => sfu.closeMessage(context, id),
                },
                Subscription: {
                    media: {
                        subscribe: (_parent, { }, context: Context) => sfu.subscribe(context)
                    },
                }
            },
            context: async ({ req, connection }) => {
                if (connection) {
                    return connection.context;
                } else {
                    return {};
                }
            }
        });
        server.listen({ port }, () => {
            console.log(`🌎 Server available at \n${
                [
                    { address: ip, family: "IPv4" },
                    ...getNetworkInterfaceInfo(),
                ].map((info) => `\thttp://${
                    info.family === "IPv6"
                        ? `[${info.address}]`
                        : info.address
                    }:${port}${server.graphqlPath}`)
                    .join("\n")
                }`
            );
            setAvailable(true)
        })
    } catch (e) {
        console.error(e)
        process.exit(-1)
    }
}

let timeout: NodeJS.Timeout | undefined
export function startServerTimeout() {
    if (timeout) { clearTimeout(timeout) }
    let startServerTimeoutEnvVar = parseInt(process.env.START_SERVER_TIMEOUT !== undefined ? process.env.START_SERVER_TIMEOUT : '')
    let startServerTimeout = startServerTimeoutEnvVar !== NaN ? startServerTimeoutEnvVar : 5
    timeout = setTimeout(() => {
        console.error(`There have been no new connections after ${startServerTimeout} minutes, shutting down`)
        process.exit(-1)
    }, 1000 * 60 * startServerTimeout)
}

function stopServerTimeout() {
    if (timeout) {
        clearTimeout(timeout)
        timeout = undefined
    }
}

main()