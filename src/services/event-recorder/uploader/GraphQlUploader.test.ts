import {
    GraphQlUploader,
    mapEventData,
} from './GraphQlUploader';
import { SequencedEventData } from '@/services/event-recorder/events/SequencedEvent';
import {
    ClientError,
    GraphQLClient,
} from 'graphql-request';
import { mocked } from 'jest-mock';

const data: SequencedEventData[] = [
    {
        streamId: `streamId`,
        sequence: 1,
        isKeyFrame: true,
        tag: `tag`,
        data: JSON.stringify({
            checkout: true,
            event: `checkout`,
            index: 0,
        }),
    },
];
const url = `http://localhost:8000/graphql`;
const mutation = `mutation`;
const refreshEndpoint = `refreshEndpoint`;

// The following error comes from the GraphQL server.
// If server is updated, this will need to be updated.
const authenticationError = Object.create(ClientError.prototype);
authenticationError.response = {
    errors: [
        {
            message: `Context creation failed: Error: Missing JWT token`,
            extensions: {
                code: `AuthenticationInvalid`,
            },
        },
    ],
    status: 400,
};

let postedErrorMessage: unknown;
Object.defineProperty(global.window.parent, `postMessage`, {
    value: (message: unknown) => {
        postedErrorMessage = message;
    },
});

let client = new GraphQLClient(url);
let mockRequest = jest.spyOn(client, `request`);
let uploader = new GraphQlUploader(client, mutation, refreshEndpoint);

describe(`GraphQlUploader`, () => {
    beforeEach(() => {
        jest.clearAllMocks();
        client = new GraphQLClient(url);
        mockRequest = jest.spyOn(client, `request`);
        uploader = new GraphQlUploader(client, mutation, refreshEndpoint);
        postedErrorMessage = undefined;
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    test(`should upload event data`, async () => {
        const mappedData = data.map(mapEventData);
        mockRequest.mockResolvedValue(undefined);
        const uploadPromise = uploader.upload(data);
        await expect(uploadPromise).resolves.toBeUndefined();
        expect(mockRequest)
            .toHaveBeenCalledTimes(1);
        expect(mockRequest)
            .toHaveBeenCalledWith(mutation, {
                streamId: data[0].streamId,
                pageEvents: mappedData,
            });
    });

    test(`should handle error`, async () => {
        const mockError = mocked(ClientError, true);
        mockRequest.mockRejectedValue(mockError);
        const uploadPromise = uploader.upload(data);
        await expect(uploadPromise).rejects.toBe(mockError);
    });

    test(`should handle authentication error by making a call to refresh endpoint`, async () => {
        mockRequest.mockRejectedValue(authenticationError);
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
            })) as jest.Mock;

        const uploadPromise = uploader.upload(data);
        await expect(uploadPromise).rejects.toBe(authenticationError);
        expect(global.fetch)
            .toHaveBeenCalledTimes(1);
        expect(global.fetch)
            .toHaveBeenCalledWith(refreshEndpoint, {
                credentials: `include`,
            });
        expect(postedErrorMessage)
            .toBeUndefined();
    });

    test(`should handle unsuccessful refresh attempt during authentication error`, async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
            })) as jest.Mock;

        mockRequest.mockRejectedValue(authenticationError);
        const uploadPromise = uploader.upload(data);
        await expect(uploadPromise).rejects.toBe(authenticationError);
        expect(postedErrorMessage)
            .toBeDefined();
        expect(postedErrorMessage)
            .toMatchSnapshot();
    });
});
