import { AuthenticationContextProvider } from "./authentication-context";
import { ServicesProvider } from "./services-provider";
import { CameraContextProvider } from "@/providers/Camera";
import { RegionSelectProvider } from "@/providers/region-select-context";
import { SessionContextProvider } from "@/providers/session-context";
import React, {
    ReactChild,
    ReactChildren,
} from "react";
import {FeatureProvider} from "@/providers/feature-context";

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
                                <CameraContextProvider>
                                    { children }
                                </CameraContextProvider>
                        </AuthenticationContextProvider>
                    </SessionContextProvider>
                </ServicesProvider>
            </FeatureProvider>
        </RegionSelectProvider>
    );
}
