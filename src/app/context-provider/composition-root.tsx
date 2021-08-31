import { SessionContextProvider } from "../../providers/session-context";
import { CameraContextProvider } from "./camera-context";
import { RegionSelectProvider } from "./region-select-context";
import { ServicesProvider } from "./services-provider";
import { UserInformationContextProvider } from "./user-information-context";
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
