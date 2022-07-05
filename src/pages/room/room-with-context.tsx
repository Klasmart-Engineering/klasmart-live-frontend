/* eslint-disable react/no-multi-comp */
import { Room } from "./room";
import { useCordovaSystemContext } from "@/app/context-provider/cordova-system-context";
import Loading from "@/components/loading";
import { StickerAnimation } from "@/components/trophies/StickerAnimation";
import {
    LiveServiceApolloClient,
    useLiveServiceApolloClient,
} from "@/data/live/liveServiceApolloClient";
import EndClass from "@/pages/end/endClass";
import LiveClassProvider from "@/providers/class/liveClassProvider";
import StudyClassProvider from "@/providers/class/studyClassProvider";
import { useSessionContext } from "@/providers/session-context";
import {
    classEndedState,
    classLeftState,
} from "@/store/layoutAtoms";
import { Typography } from "@material-ui/core";
import React,
{
    useEffect,
    useMemo,
} from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

export const RoomWithContext: React.FC = ({ children }) => {
    const {
        sessionId,
        token,
    } = useSessionContext();

    return (
        <LiveServiceApolloClient
            token={token}
            sessionId={sessionId}
        >
            {children}
        </LiveServiceApolloClient>
    );
};

export const LIVE_ON_BACK_ID = `liveOnBackID`;

export const LiveRoom: React.FC = () => {
    const { removeOnBack } = useCordovaSystemContext();
    const [ classLeft ] = useRecoilState(classLeftState);
    const [ classEnded ] = useRecoilState(classEndedState);

    useEffect(() => {
        if(classLeft || classEnded) {
            removeOnBack?.(LIVE_ON_BACK_ID);
        }
    }, [ classLeft, classEnded ]);

    if(classLeft || classEnded){
        return <EndClass />;
    }

    return (
        <LiveClassProvider>
            <LiveLoading>
                <Room />
                <StickerAnimation />
            </LiveLoading>
        </LiveClassProvider>
    );
};

const LiveLoading: React.FC = ({ children }) => {
    const { isLoading: liveLoading, isError: liveError } = useLiveServiceApolloClient();

    const isLoading = useMemo(() => liveLoading, [ liveLoading ]);
    const isError = useMemo(() => liveError, [ liveError ]);

    if (isLoading) {
        return <Loading messageId="loading" />;
    }

    if (isError) {
        return (
            <Typography>
                <FormattedMessage id="failed_to_connect" />
            </Typography>
        );
    }

    return (
        <>
            {children}
        </>
    );
};

const StudyLoading: React.FC = ({ children }) => {
    const { isLoading, isError } = useLiveServiceApolloClient();

    if (isLoading) {
        return <Loading messageId="loading" />;
    }

    if (isError) {
        return (
            <Typography>
                <FormattedMessage id="failed_to_connect" />
            </Typography>
        );
    }

    return (
        <>
            {children}
        </>
    );
};

export const StudyRoom: React.FC = () => {
    return (
        <StudyClassProvider>
            <StudyLoading>
                <Room />
                <StickerAnimation />
            </StudyLoading>
        </StudyClassProvider>
    );
};
