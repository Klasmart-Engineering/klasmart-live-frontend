import { RegionSelectProvider } from "./region-select-context";
import { SessionContextProvider } from "./session-context";
import { ServicesProvider } from "@/app/context-provider/services-provider";
import { FeatureProvider } from "@/providers/feature-context";
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
                        { children }
                    </SessionContextProvider>
                </ServicesProvider>
            </FeatureProvider>
        </RegionSelectProvider>
    );
}
