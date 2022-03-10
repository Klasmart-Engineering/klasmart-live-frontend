import { AuthenticationContextProvider } from "./authentication-context";
import { ServicesProvider } from "./services-provider";
import { FeatureProvider } from "@/providers/feature-context";
import { RegionSelectProvider } from "@/providers/region-select-context";
import { SessionContextProvider } from "@/providers/session-context";
import React, {
    ReactChild,
    ReactChildren,
} from "react";

type Props = {
    children: ReactChild | ReactChildren | null;
    sessionId: string;
}

export function CompositionRoot ({ children, sessionId }: Props) {
    return (
        <RegionSelectProvider>
            <FeatureProvider>
                <ServicesProvider>
                    <SessionContextProvider sessionId={sessionId}>
                        <AuthenticationContextProvider>
                            { children }
                        </AuthenticationContextProvider>
                    </SessionContextProvider>
                </ServicesProvider>
            </FeatureProvider>
        </RegionSelectProvider>
    );
}
