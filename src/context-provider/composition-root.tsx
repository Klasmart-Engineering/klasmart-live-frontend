import React, { ReactChild, ReactChildren } from "react";
import { CameraContextProvider } from "../components/media/useCameraContext";
import { RegionSelectProvider } from "./region-select-context";
import { ServicesProvider } from "./services-provider";
import { UserContextProvider } from "./user-context";
import { UserInformationContextProvider } from "./user-information-context";

type Props = {
    children: ReactChild | ReactChildren | null
    sessionId: string
}

export function CompositionRoot({ children, sessionId }: Props) {

    return (
        <RegionSelectProvider>
            <ServicesProvider>
                <UserContextProvider sessionId={sessionId}>
                    <UserInformationContextProvider>
                        <CameraContextProvider>
                            { children }
                        </CameraContextProvider>
                    </UserInformationContextProvider>
                </UserContextProvider>
            </ServicesProvider>
        </RegionSelectProvider>
    );
}