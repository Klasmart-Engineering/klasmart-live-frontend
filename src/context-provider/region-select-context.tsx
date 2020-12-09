import React, { createContext, ReactChild, ReactChildren, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type Service = "auth" | "live" | "cms" | "sfu" | "user"

export type Region = {
    id: string,
    name: string,
    development: boolean,
    services: Record<Service, string>,
}

export interface IRegionSelectContext {
    regions?: Region[],
    region?: Region,
    selectRegion?: (id: string) => void,
    loading: boolean,
}

type Props = {
    children?: ReactChild | ReactChildren | null;
    regionsUrl?: string
}

const RegionSelectContext = createContext<IRegionSelectContext>({ loading: false });

const DefaultRegions: Region[] = [
    {
        id: "prod",
        name: "Production",
        development: false,
        services: {
            auth: "https://auth.kidsloop.net",
            live: "https://live.kidsloop.net",
            cms: "https://kl2.kidsloop.net",
            sfu: "https://live.kidsloop.net/sfu",
            user: "https://api.kidsloop.net/user/"
        }
    },
    {
        id: "dev",
        name: "Development",
        development: true,
        services: {
            auth: "https://auth.kidsloop.net",
            live: "https://live.kidsloop.net",
            cms: "https://kl2.kidsloop.net",
            sfu: "https://live.kidsloop.net/sfu",
            user: "https://api.kidsloop.net/user/"
        }
    }
];

export function RegionSelectProvider({ children, regionsUrl }: Props) {
    const [regions, setRegions] = useState<Region[]>(DefaultRegions);
    const [region, setRegion] = useState<Region>(DefaultRegions[0]);

    const [loading, setLoading] = useState<boolean>(false);

    const fetchRegions = useCallback(async () => {
        if (!regionsUrl) return;

        setLoading(true);

        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");

        const response = await fetch(regionsUrl, {
            headers,
            method: "GET",
        });

        // TODO: Better typesafe way to retrieve the regions array, perhaps 
        // with data validation framework?
        const { regions }: { regions: Region[] } = await response.json();

        setRegions(regions);
        setLoading(false);
    }, []);

    const selectRegion = useCallback((id: string) => {
        if (!regions) {
            console.error(`Can't select region with ID: ${id}. No regions available.`);
            return;
        }

        const region = regions.find(region => region.id === id);
        if (!region) {
            console.error(`Can't select region with ID: ${id}. No region with ID.`);
            return;
        }

        setRegion(region);
    }, []);

    useEffect(() => {
        fetchRegions();
    }, [regionsUrl]);

    return (
        <RegionSelectContext.Provider value={{ regions, region, selectRegion, loading }}>
            { children}
        </RegionSelectContext.Provider>
    );
}

export function useRegionSelect() {
    return useContext(RegionSelectContext);
}

export function useWebsocketEndpoint(service: Service) {
    const { region } = useRegionSelect();

    const endpoint = useMemo(() => {
        if (!region) return "";

        const serviceEndpoint = region.services[service];
        return serviceEndpoint
            .replace('https://', 'wss://')
            .replace('http://', 'ws://');
    }, [region, service]);

    return endpoint;
}

export function useHttpEndpoint(service: Service) {
    const { region } = useRegionSelect();

    const endpoint = useMemo(() => {
        if (!region) return "";

        const serviceEndpoint = region.services[service];
        return serviceEndpoint
            .replace('wss://', 'https://')
            .replace('ws://', 'http://');
    }, [region, service]);

    return endpoint;
}