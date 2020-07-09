import { IEventUploader } from "./IEventUploader";
import { SequencedEventData } from "../events/SequencedEvent";

export class MockEventUploader implements IEventUploader {
  upload (eventData: SequencedEventData[]) : Promise<void> {
      console.log(eventData);
      return Promise.resolve()
  }
}