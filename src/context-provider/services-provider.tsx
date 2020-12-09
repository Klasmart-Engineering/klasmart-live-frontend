import React, { createContext, ReactChild, ReactChildren, useContext, useMemo } from "react";
import { AuthenticationService } from "../services/auth/AuthenticationService";
import { IAuthenticationService } from "../services/auth/IAuthenticationService";
import { ContentService } from "../services/cms/ContentService";
import { IContentService } from "../services/cms/IContentService";
import { ISchedulerService } from "../services/cms/ISchedulerService";
import { SchedulerService } from "../services/cms/SchedulerService";
import { IUserInformationService } from "../services/user/IUserInformationService";
import { UserInformationService } from "../services/user/UserInformationService";
import { useHttpEndpoint } from "./region-select-context";

type Props = {
    children?: ReactChild | ReactChildren | null
}

type ServicesContext = {
    authenticationService?: IAuthenticationService,
    schedulerService?: ISchedulerService,
    contentService?: IContentService,
    userInformationService?: IUserInformationService,
}

const ServicesContext = createContext<ServicesContext>({});

export function ServicesProvider({ children }: Props) {
    const authenticationServiceEndpoint = useHttpEndpoint("auth");
    const cmsServiceEndpoint = useHttpEndpoint("cms");
    const userInformationEndpoint = useHttpEndpoint("user");

    const authenticationService = useMemo(() => {
        return new AuthenticationService(authenticationServiceEndpoint);
    }, [authenticationServiceEndpoint]);

    const schedulerService = useMemo(() => {
        return new SchedulerService(cmsServiceEndpoint, authenticationService);
    }, [cmsServiceEndpoint, authenticationService]);

    const contentService = useMemo(() => {
        return new ContentService(cmsServiceEndpoint, authenticationService);
    }, [cmsServiceEndpoint, authenticationService]);

    const userInformationService = useMemo(() => {
        return new UserInformationService(userInformationEndpoint, authenticationService);
    }, [userInformationEndpoint, authenticationService]);

    return (
        <ServicesContext.Provider value={{ authenticationService, schedulerService, contentService, userInformationService }}>
            { children }
        </ServicesContext.Provider>
    );
}

export function useServices() {
    return useContext(ServicesContext);
}