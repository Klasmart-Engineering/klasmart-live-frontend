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
}

export function CompositionRoot ({ children }: Props) {

    return (

        <RegionSelectProvider>
            <FeatureProvider>
                <ServicesProvider>
                    <SessionContextProvider>
                        {children}
                    </SessionContextProvider>
                </ServicesProvider>
            </FeatureProvider>
        </RegionSelectProvider>

    );
}
