import { useHttpEndpoint } from "@/providers/region-select-context";
import { useSessionContext } from "@/providers/session-context";

function useRefreshToken () {

    const liveEndpoint = useHttpEndpoint(`live`);

    const {
        scheduleId,
        organizationId,
        token,
    } = useSessionContext();
    const refreshToken = async () => {

        if (token && scheduleId && organizationId) {
            const headers = token ? {
                authorization: `Bearer ${token}`,
            } : undefined;

            try {
                const response = await fetch(`${liveEndpoint}/v1/schedules/${scheduleId}/live/token?live_token_type=live&org_id=${organizationId}`, {
                    headers,
                    method: `GET`,
                    credentials: `include`,
                });
                const data = await response.json();

                if(data?.token) {
                    window.location.replace(`${liveEndpoint}/?token=${data?.token}`);
                }

                return data;
            } catch (error) {
                //
            }
        }

    };
    return {
        refreshToken,
    };
}

export default useRefreshToken;
