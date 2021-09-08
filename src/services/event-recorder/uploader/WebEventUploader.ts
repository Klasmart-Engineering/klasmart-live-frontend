import { SequencedEventData } from '@/services/event-recorder/events/SequencedEvent';
import { IEventUploader } from './IEventUploader';

export class WebEventUploader implements IEventUploader {
    private readonly endpoint: string;

    constructor (endpoint: string) {
        this.endpoint = endpoint;
    }

    async upload (eventData: SequencedEventData[]) : Promise<void> {
        const request = {
            method: `POST`,
            headers: {
                'Content-Type': `application/json`,
            },
            body: JSON.stringify(eventData),
        };

        const response = await fetch(this.endpoint, request);
        const data = await response.json();

        if (!response.ok) {
            const error = (data && data.message) || response.status;
            return Promise.reject(error);
        }
    }
}
