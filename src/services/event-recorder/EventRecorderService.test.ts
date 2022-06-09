import { EventRecorderService } from './EventRecorderService';
import { EventStream } from './stream/EventStream';
import { IEventUploader } from './uploader/IEventUploader';

describe(`EventRecorderService`, () => {

    const mockUploader: IEventUploader = {
        upload: jest.fn(),
    };

    let eventRecorderService: EventRecorderService;

    describe(`uploadEvents`, () => {
        beforeEach(() => {
            jest.clearAllMocks();
            (mockUploader.upload as jest.Mock).mockReset();
            eventRecorderService = new EventRecorderService(mockUploader);
        });

        test(`uploadEvents resolves to initial promise when another upload is in progress`, async () => {
            addEventToQueue(eventRecorderService, `test-stream`);

            (mockUploader.upload as jest.Mock).mockImplementation(() => {
                return new Promise<void>((res) => {
                    res();
                });
            });

            const initialPromise = eventRecorderService.uploadEvents();
            const secondaryPromise = eventRecorderService.uploadEvents();

            expect(initialPromise).toBe(secondaryPromise);

            // Make sure these are resolved
            await Promise.all([ initialPromise, secondaryPromise ]);
        });

        test(`should immediately resolve to undefined when the queue is empty`, async () => {
            (mockUploader.upload as jest.Mock).mockResolvedValue(undefined);

            await eventRecorderService.uploadEvents();

            // Tested only to validate that empty queue results in immediate resolution
            expect(mockUploader.upload as jest.Mock).not.toHaveBeenCalled();
        });

        test(`should reject when upload fails repeatedly`, async () => {
            // Ensure there is at least one item in the queue to upload
            addEventToQueue(eventRecorderService, `test-stream`);

            const expectedError = new Error(`test rejection`);
            (mockUploader.upload as jest.Mock).mockRejectedValue(expectedError);

            const promise = eventRecorderService.uploadEvents();

            await expect(promise).rejects.toThrow(`Failed to upload 1 event`);
        });

        test(`should reattempt failed uploads at least once`, async () => {
            //! Note: Currently max upload attempts in not configurable.
            //! This test only assumes that the uploader will reattempt at least once

            // Ensure there is at least one item in the queue to upload
            addEventToQueue(eventRecorderService, `test-stream`);

            const expectedError = new Error(`test rejection once`);

            (mockUploader.upload as jest.Mock).mockResolvedValue(`test-clear`);
            (mockUploader.upload as jest.Mock).mockRejectedValueOnce(expectedError);

            const promise = eventRecorderService.uploadEvents();

            await expect(promise).resolves.toBeUndefined();
        });
    });
});

/**
 * Utility function to add an item to the upload queue
 * @param eventRecorderService
 * @param tagName
 */
function addEventToQueue (eventRecorderService: EventRecorderService, tagName: string) {
    const stream = EventStream.builder().withRandomId().withTag(tagName).build();
    eventRecorderService.recordEvent(stream, expect.getState().currentTestName, false);
}
