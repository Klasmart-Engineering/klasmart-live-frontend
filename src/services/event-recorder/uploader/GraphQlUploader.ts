import { IEventUploader } from "./IEventUploader";
import { SequencedEventData } from "@/services/event-recorder//events/SequencedEvent";
import {
    ClientError,
    GraphQLClient,
} from "graphql-request";

interface PageEventIn {
    sequenceNumber: number;
    isKeyframe: boolean;
    eventsSinceKeyframe: number;
    eventData: string;
}

export interface PageEvent {
    checkout: boolean;
    event: string;
    index: number;
}

// TODO: Mapping the data to prevent having to make too many changes
// to how the server deals with events for now, or changing how the
// EventRecorderService stores event data. So there's some overlap.
// The DynamoDB implementation will need a sequence which always
// increase for each stream, or at least until the MAX_SAFE_INTEGER.
export function mapEventData (x: SequencedEventData): PageEventIn {
    const domain: PageEvent = JSON.parse(x.data);

    return {
        sequenceNumber: x.sequence,
        isKeyframe: x.isKeyFrame,
        eventsSinceKeyframe: domain.index,
        eventData: JSON.stringify(domain.event),
    };
}

export class GraphQlUploader implements IEventUploader {
    private readonly client: GraphQLClient;
    private readonly mutation: string;
    private readonly refreshEndpoint: string;

    constructor (client: GraphQLClient, mutation: string, refreshEndpoint: string) {
        this.client = client;
        this.mutation = mutation;
        this.refreshEndpoint = refreshEndpoint;
    }

    async upload (eventData: SequencedEventData[]): Promise<void> {
        // TODO: Group events by streamId.
        const streamId = eventData[0].streamId;
        const mappedEvents = eventData.map(mapEventData);

        try {
            await this.client.request(this.mutation, {
                streamId,
                pageEvents: mappedEvents,
            });
        } catch (e) {
            if (e instanceof ClientError) {
                const errors: unknown[] = e.response.errors || [];
                const authenticationError = errors.some((e: any) => e.extensions.code === `AuthenticationInvalid` || e.extensions.code === `AuthenticationExpired`);
                if (authenticationError) {
                    await handleAuthenticationError(this.refreshEndpoint);
                }
            }
            return Promise.reject(e);
        }
    }
}

async function handleAuthenticationError (refreshEndpoint: string) {
    try {
        const response = await fetch(refreshEndpoint, {
            credentials: `include`,
        });

        if (!response.ok) {
            window.parent.postMessage({
                error: `RedirectToLogin`,
            }, window.location.origin);
        }
    } catch (e) {
        console.error(e);
    }
}
