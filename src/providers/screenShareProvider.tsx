import { useSessionContext } from "./session-context";
import { WebRTCContext } from "./WebRTCContext";
import { useShowContentMutation } from "@/data/live/mutations/useShowContentMutation";
import { ContentType } from "@/pages/utils";
import { types as MediaSoup } from "mediasoup-client";
import React,
{
    createContext,
    useContext,
    useState,
} from "react";

export interface ScreenShareContextInterface {
    stream: MediaStream | undefined;
    start: () => Promise<void>;
    stop: () => Promise<void>;
}

const defaultScreenShareContext = {
    stream: undefined,
    start: () => Promise.resolve(),
    stop: () => Promise.resolve(),
};

export const ScreenShareContext = createContext<ScreenShareContextInterface>(defaultScreenShareContext);

export const ScreenShareProvider = (props: {children: React.ReactNode}) => {
    const [ stream, setStream ] = useState<MediaStream | undefined>();
    const [ producers, setProducers ] = useState<MediaSoup.Producer[]>([]);
    const [ starting, setStarting ] = useState<boolean>(false);
    const [ stopping, setStopping ] = useState<boolean>(false);
    const sfuState = useContext(WebRTCContext);
    const { roomId, sessionId } = useSessionContext();

    const [ showContent ] = useShowContentMutation();

    window.addEventListener(`beforeunload`, () => {
        stop();
    }, false);

    stream?.getVideoTracks()[0].addEventListener(`ended`, () => {
        stop();
    });

    const start = async () => {
        if(stream) {return;}
        if(starting) {return;}
        try {
            setStarting(true);
            await stop();
            const stream = await ((navigator.mediaDevices as any).getDisplayMedia({
                audio: true,
                video: true,
            }) as Promise<MediaStream>);
            setStream(stream);
            const auxStreams= await sfuState.transmitStream(`aux`, stream, false);
            setProducers(auxStreams);
            showContent({
                variables: {
                    roomId,
                    type: ContentType.Screen,
                    contentId: sessionId,
                },
            });
        } catch(e) {
            console.log(e);
        } finally {
            setStarting(false);
        }
    };

    const stop = () => {
        if(!stream || stopping) {
            return Promise.resolve();
        }

        try {
            setStopping(true);
            for(const producer of producers) {
                producer.close();
            }
            setProducers([]);
            for(const track of stream.getTracks()) {
                track.stop();
            }
            setStream(undefined);
            showContent({
                variables: {
                    roomId,
                    type: ContentType.Camera,
                    contentId: sessionId,
                },
            });
        } finally {
            setStopping(false);
        }

        return Promise.resolve();
    };
    const value = {
        stream,
        start,
        stop,
    };

    return(
        <ScreenShareContext.Provider value={value}>
            {props.children}
        </ScreenShareContext.Provider>
    );
};
