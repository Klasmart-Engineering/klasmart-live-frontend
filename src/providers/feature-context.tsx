import React, {createContext, ReactChild, ReactChildren, useContext} from "react";
import {useRegionSelect} from "@/providers/region-select-context";

export enum FeatureFlag {
    NONE,
    ONLY_OBSERVE_IN_VIEWPORT
}

export interface IFeatureContext {
    features: FeatureFlag[];
    isFeatureEnabled: (features: FeatureFlag[], flag: FeatureFlag) => boolean;
}

const FeatureContext = createContext<IFeatureContext>({
    features: [],
    isFeatureEnabled: (flag) => false
});

type FeatureProviderProps = {
    children?: ReactChild | ReactChildren | null;
}

export function FeatureProvider({children}: FeatureProviderProps) {
    const { region } = useRegionSelect();

    function isFeatureEnabled(features: FeatureFlag[], flag: FeatureFlag) {
        return features.includes(flag);
    }

    return (
        <FeatureContext.Provider value={{features: region?.features ?? [], isFeatureEnabled}}>
            {children}
        </FeatureContext.Provider>
    );
}

export function useFeatureFlags() {
    return useContext(FeatureContext);
}
