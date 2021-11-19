import { useAuthenticationContext } from "./authentication-context";
import {
    DATA_STALE_TIME,
    REQUEST_RETRY_COUNT_MAX,
} from "@/config";
import { useHttpEndpoint } from "@/providers/region-select-context";
import { CmsApiClientProvider as KLCmsApiClientProvider } from "@kidsloop/cms-api-client";
import React from "react";

interface Props {
    children: React.ReactNode;
}

export default function CmsApiClientProvider (props: Props) {
    const { children } = props;
    const cmsServiceEndpoint = useHttpEndpoint(`cms`);
    const { actions } = useAuthenticationContext();

    return (
        <KLCmsApiClientProvider
            config={{
                baseURL: cmsServiceEndpoint,
                withCredentials: true,
            }}
            queryOptions={{
                defaultOptions: {
                    queries: {
                        staleTime: DATA_STALE_TIME,
                        retry: REQUEST_RETRY_COUNT_MAX,
                    },
                },
            }}
            interceptors={[
                {
                    onRejected: async (err) => {
                        if (err?.response?.status !== 401 || err?.response?.data.label !== `general_error_unauthorized`) return err;
                        try {
                            await actions?.refreshAuthenticationToken();
                        } catch (err) {
                            await actions?.signOut();
                            return err;
                        }
                    },
                },
            ]}
        >
            {children}
        </KLCmsApiClientProvider>
    );
}
