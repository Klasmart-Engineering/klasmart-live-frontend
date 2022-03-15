import Join from './join/join';
import { RoomWithContext } from './room/room-with-context';
import { useAuthenticationContext } from '@/app/context-provider/authentication-context';
import { useServices } from '@/app/context-provider/services-provider';
import { useRegionSelect } from '@/providers/region-select-context';
import { useSessionContext } from '@/providers/session-context';
import { AuthTokenProvider } from "@/services/auth-token/AuthTokenProvider";
import { hasJoinedClassroomState } from "@/store/layoutAtoms";
import { useInterval } from '@/utils/useInterval';
import { WebRtcProvider } from "kidsloop-live-state/ui";
import React,
{ useMemo } from 'react';
import { useRecoilValue } from "recoil";

const TOKEN_REFRESH_INTERVAL_MS = 10 * 60 * 1000; //Ten Minutes

export function WebApp () {
    const { name, sessionId } = useSessionContext();
    const { actions } = useAuthenticationContext();
    const { authenticationService } = useServices();
    useInterval(authenticationService?.refresh, TOKEN_REFRESH_INTERVAL_MS);

    const schedule = () => {
        const ENDPOINT_HUB = process.env.ENDPOINT_HUB;
        if (ENDPOINT_HUB) {
            // Use replace, so they don't immediately click the back button
            window.location.replace(`${ENDPOINT_HUB}/#/schedule`);
        } else {
            console.error(`ENDPOINT_HUB not set`);
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
        const token = AuthTokenProvider.retrieveToken();
        if(token) { url.searchParams.set(`authorization`, token); }
        return url;
    }, [ region ]);

    return <WebRtcProvider
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
        {
            hasJoinedClassroom && name
                ? <RoomWithContext />
                : <Join />
        }
    </WebRtcProvider>;
}
