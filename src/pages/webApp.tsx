import Join from './join/join';
import { RoomWithContext } from './room/room-with-context';
import { useServices } from "@/app/context-provider/services-provider";
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
    const { authenticationService  } = useServices();
    const refreshToken = async () => {
        if (!authenticationService) {
            console.error(`No authentication service`);
            return;
        }
        const refreshed = await authenticationService.refresh().catch(e => {
            console.error(`Failed to refresh token`, e);
            return false;
        });

        if (refreshed) { return; }

        console.error(`Failed to refresh token, signing out`);
        try {
            await authenticationService.signout();
        } finally {
            authenticationService.redirectToLogin();
        }
    };
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

    useInterval(refreshToken, TOKEN_REFRESH_INTERVAL_MS);
    return <WebRtcProvider
        sessionId={sessionId}
        endpoint={endpoint}
        onAuthorizationExpired={schedule}
        onAuthorizationInvalid={schedule}
        onAuthenticationInvalid={refreshToken}
        onAuthenticationExpired={refreshToken}
        onTokenMismatch={schedule}
        onMissingAuthenticationToken={refreshToken}
        onMissingAuthorizationToken={schedule}
    >
        {
            hasJoinedClassroom && name
                ? <RoomWithContext />
                : <Join />
        }
    </WebRtcProvider>;
}
