import { Room } from "./room";
import Loading from "@/components/loading";
import { Trophy } from "@/components/trophies/trophy";
import {
    LiveServiceApolloClient,
    useLiveServiceApolloClient,
} from "@/data/live/liveServiceApolloClient";
import { useSfuServiceApolloClient } from "@/data/sfu/sfuServiceApolloClient";
import EndClass from "@/pages/end/endClass";
import LiveClassProvider from "@/providers/class/liveClassProvider";
import StudyClassProvider from "@/providers/class/studyClassProvider";
import { useSessionContext } from "@/providers/session-context";
import { ClassType } from "@/store/actions";
import {
    classEndedState,
    classLeftState,
} from "@/store/layoutAtoms";
import {
    Grid,
    Typography,
} from "@material-ui/core";
import React,
{ useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useRecoilState } from "recoil";

export function RoomWithContext (): JSX.Element {
    const {
        sessionId,
        token,
        classType,
    } = useSessionContext();

    return (
        <LiveServiceApolloClient
            token={token}
            sessionId={sessionId}
        >
            { classType == ClassType.STUDY ? <StudyRoom /> : <LiveRoom /> }
        </LiveServiceApolloClient>
    );
}

const LiveRoom: React.FC = () => {
    const [ classLeft ] = useRecoilState(classLeftState);
    const [ classEnded ] = useRecoilState(classEndedState);

    if(classLeft || classEnded){
        return <EndClass />;
    }

    return (
        <LiveClassProvider>
            <LiveLoading>
                <Room />
                <Trophy />
            </LiveLoading>
        </LiveClassProvider>
    );
};

const LiveLoading: React.FC = ({ children }) => {
    const { isLoading: liveLoading, isError: liveError } = useLiveServiceApolloClient();
    const { isLoading: sfuLoading, isError: sfuError } = useSfuServiceApolloClient();

    const isLoading = useMemo(() => liveLoading || sfuLoading, [ liveLoading, sfuLoading ]);
    const isError = useMemo(() => liveError || sfuError, [ liveError, sfuError ]);

    if (isLoading) {
        return (
            <Grid
                container
                alignItems="center"
                style={{
                    height: `100%`,
                }}
            >
                <Loading messageId="loading" />
            </Grid>
        );
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
        return (
            <Grid
                container
                alignItems="center"
                style={{
                    height: `100%`,
                }}
            >
                <Loading messageId="loading" />
            </Grid>
        );
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

const StudyRoom: React.FC = () => {
    return (
        <StudyClassProvider>
            <StudyLoading>
                <Room />
                <Trophy />
            </StudyLoading>
        </StudyClassProvider>
    );
};
