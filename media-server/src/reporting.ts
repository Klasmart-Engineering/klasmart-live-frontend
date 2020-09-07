import Cloudwatch from "aws-sdk/clients/cloudwatch"
const CloudwatchClient = new Cloudwatch({
    region: process.env.AWS_REGION
})

let _service = `SFU`

let _dockerId = "UnknownDockerId"
export function setDockerId(dockerId: string) {
    _dockerId = dockerId
}

let _cluster = "UknownClusterId"
export function setClusterId(clusterId: string) {
    _cluster = clusterId
}

let _graphQlConnections = 0
export function setGraphQLConnections(count: number) {
    _graphQlConnections = count
}

let producersCreated = 0
export function incrementProducerCount() { producersCreated++ }
export function decrementProducerCount() { producersCreated-- }

let consumersCreated = 0
export function incrementConsumerCount() { consumersCreated++ }
export function decrementConsumerCount() { consumersCreated-- }


//Used for autoscaling to know how many servers are standying by available to be assigned to a class
let _available = 0
export function setAvailable(available: boolean) {
    _available = available ? 1 : 0
}


const reportIntervalMs = 5000
async function reporting(invokeTime = Date.now()) {
    try {
        const result = await CloudwatchClient.putMetricData({
            Namespace: "kidsloop/live/sfu", MetricData: [
                {
                    MetricName: "producers",
                    Value: producersCreated,
                    Unit: "Count",
                    Dimensions: [
                        { Name: 'DockerId', Value: _dockerId },
                        { Name: 'ClusterId', Value: _cluster },
                    ]
                },
                {
                    MetricName: "consumers",
                    Value: consumersCreated,
                    Unit: "Count",
                    Dimensions: [
                        { Name: 'DockerId', Value: _dockerId },
                        { Name: 'ClusterId', Value: _cluster },
                    ]
                },
                {
                    MetricName: "graphql_connections",
                    Value: _graphQlConnections,
                    Unit: "Count",
                    Dimensions: [
                        { Name: 'DockerId', Value: _dockerId },
                        { Name: 'ClusterId', Value: _cluster },
                    ]
                },
                {
                    MetricName: "available",
                    Value: _available,
                    Unit: "Count",
                    Dimensions: [
                        { Name: 'ClusterId', Value: _cluster },
                    ]
                },
                {
                    MetricName: "online",
                    Value: 1,
                    Unit: "Count",
                    Dimensions: [
                        { Name: 'ClusterId', Value: _cluster },
                    ]
                },
            ]
        }).promise()
    } catch (e) {
        console.error(e)
    } finally {
        const waitTime = (invokeTime + reportIntervalMs) - Date.now()
        setTimeout(() => reporting(), Math.max(0, waitTime))
    }
}

if (process.env.REPORT_CLOUDWATCH_METRICS) {
    setTimeout(() => reporting(), reportIntervalMs)
}