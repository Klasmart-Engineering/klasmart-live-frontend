import React, { ReactChild, ReactChildren } from "react";
import { CameraContextProvider } from "../components/media/useCameraContext";
import { RegionSelectProvider } from "./region-select-context";
import { ServicesProvider } from "./services-provider";
import { SessionContextProvider } from "./session-context";
import { UserInformationContextProvider } from "./user-information-context";

type Props = {
    children: ReactChild | ReactChildren | null
    sessionId: string
}

export function CompositionRoot({ children, sessionId }: Props) {

    return (
        <RegionSelectProvider>
            <ServicesProvider>
                <SessionContextProvider sessionId={sessionId}>
                    <UserInformationContextProvider>
                        <CameraContextProvider>
                            { children }
                        </CameraContextProvider>
                    </UserInformationContextProvider>
                </SessionContextProvider>
            </ServicesProvider>
        </RegionSelectProvider>
    );
}