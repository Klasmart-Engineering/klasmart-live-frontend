import { RegionSelectProvider } from "./region-select-context";
import { SessionContextProvider } from "./session-context";
import { ServicesProvider } from "@/app/context-provider/services-provider";
import React, {
    ReactChild,
    ReactChildren,
} from "react";
import { CameraContextProvider } from "../app/context-provider/camera-context";

type Props = {
    children: ReactChild | ReactChildren | null;
    sessionId: string;
}

export function CompositionRoot ({ children, sessionId }: Props) {
    return (
        <RegionSelectProvider>
            <ServicesProvider>
                <SessionContextProvider sessionId={sessionId}>
                    <CameraContextProvider>
                        { children }
                    </CameraContextProvider>
                </SessionContextProvider>
            </ServicesProvider>
        </RegionSelectProvider>
    );
}
