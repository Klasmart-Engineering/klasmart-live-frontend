import { CameraContextProvider } from "./Camera";
import { RegionSelectProvider } from "./region-select-context";
import { SessionContextProvider } from "./session-context";
import { ServicesProvider } from "@/app/context-provider/services-provider";
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
                        <CameraContextProvider>
                            { children }
                        </CameraContextProvider>
                    </SessionContextProvider>
                </ServicesProvider>
            </FeatureProvider>
        </RegionSelectProvider>
    );
}
