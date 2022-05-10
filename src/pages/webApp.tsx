import Join from './join/join';
import JoinApp from './join/joinApp';
import {
    LiveRoom,
    RoomWithContext,
    StudyRoom,
} from './room/room-with-context';
import { ClassSelectAttendees } from './selectAttendees';
import { useAuthenticationContext } from '@/app/context-provider/authentication-context';
import { useServices } from '@/app/context-provider/services-provider';
import { useRegionSelect } from '@/providers/region-select-context';
import { useSessionContext } from '@/providers/session-context';
import { ClassType } from '@/store/actions';
import {
    hasJoinedClassroomState,
    showSelectAttendeesState,
} from "@/store/layoutAtoms";
import { useInterval } from '@/utils/useInterval';
import { WebRtcProvider } from "@kl-engineering/live-state/ui";
import React,
{ useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilValue } from "recoil";

const TOKEN_REFRESH_INTERVAL_MS = 10 * 60 * 1000; //Ten Minutes

export function WebApp () {
    const history = useHistory();
    const {
        name,
        sessionId,
        classType,
        token,
    } = useSessionContext();
    const { actions } = useAuthenticationContext();
    const { authenticationService } = useServices();
    useInterval(() => authenticationService?.refresh(), TOKEN_REFRESH_INTERVAL_MS);
    const showSelectParticipants = useRecoilValue(showSelectAttendeesState);

    const schedule = () => {
        if (process.env.IS_CORDOVA_BUILD) {
            history.replace(`/schedule`);
        } else {
            const ENDPOINT_HUB = process.env.ENDPOINT_HUB;
            if (ENDPOINT_HUB) {
                // Use replace, so they don't immediately click the back button
                window.location.replace(`${ENDPOINT_HUB}/#/schedule`);
            } else {
                console.error(`ENDPOINT_HUB not set`);
            }
        }
    };
    const hasJoinedClassroom = useRecoilValue(hasJoinedClassroomState);
    const { region } = useRegionSelect();
    const endpoint = useMemo(() => {
        const urlString = region?.services.live ?? window.location.toString();
        const url = new URL(urlString);
        if(url.hostname === `localhost`) {url.port = `8002`;}
        url.search = window.location.search;
        url.searchParams.delete(`token`);
        if(token) { url.searchParams.set(`authorization`, token); }
        return url;
    }, [ region, token ]);

    const renderChildren = () => {
        if(showSelectParticipants) return <ClassSelectAttendees />;

        switch(classType){
        case ClassType.LIVE:
            return <LiveRoom />;
        default :
            return <StudyRoom />;
        }
    };

    return (
        <WebRtcProvider
            sessionId={sessionId}
            endpoint={endpoint}
            onAuthorizationExpired={schedule}
            onAuthorizationInvalid={schedule}
            onAuthenticationInvalid={actions?.refreshAuthenticationToken}
            onAuthenticationExpired={actions?.refreshAuthenticationToken}
            onTokenMismatch={schedule}
            onMissingAuthenticationToken={actions?.refreshAuthenticationToken}
            onMissingAuthorizationToken={schedule}
        >
            {hasJoinedClassroom && name ? (
                <RoomWithContext>{renderChildren()}</RoomWithContext>
            )
                : process.env.IS_CORDOVA_BUILD ? <JoinApp /> : <Join />
            }
        </WebRtcProvider>
    );
}
