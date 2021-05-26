import React, { createContext, ReactChild, ReactChildren, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { useSelector, useDispatch } from "react-redux";
import { State } from "../store/store";
import { setRegion } from "../store/reducers/session";

export type Service = "auth" | "live" | "cms" | "sfu" | "user" | "privacy"

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
            user: "https://api.kidsloop.net/user/",
            privacy: "https://kidsloop.net/en/policies/privacy-notice"
        }
    },
    {
        id: "uk",
        name: "UK Production",
        development: false,
        services: {
            auth: "https://auth.kidsloop.co.uk",
            live: "https://live.kidsloop.co.uk",
            cms: "https://kl2.kidsloop.co.uk",
            sfu: "https://live.kidsloop.co.uk/sfu",
            user: "https://api.kidsloop.co.uk/user/",
            privacy: "https://kidsloop.co.uk/en/policies/privacy-notice"
        }
    },
    {
        id: "alpha",
        name: "Alpha",
        development: true,
        services: {
            auth: "https://auth.alpha.kidsloop.net",
            live: "https://live.alpha.kidsloop.net",
            cms: "https://cms.alpha.kidsloop.net",
            sfu: "https://live.alpha.kidsloop.net/sfu",
            user: "https://api.alpha.kidsloop.net/user/",
            privacy: "https://kidsloop.net/en/policies/privacy-notice"
        }
    }
];

export function RegionSelectProvider({ children, regionsUrl }: Props) {
    const [regions, setRegions] = useState<Region[]>(DefaultRegions);
    const [loading, setLoading] = useState<boolean>(false);
    const regionId = useSelector((state: State) => state.session.regionId);

    const dispatch = useDispatch();

    const region = useMemo<Region>(() => {
        if (!regions) {
            console.error(`Can't select region with ID: ${regionId}. No regions available. Falling back to default.`);
            return DefaultRegions[0];
        }

        const selected = regions.find(region => region.id === regionId);
        if (selected === undefined) {
            console.error(`Can't select region with ID: ${regionId}. No region with ID. Falling back to default.`);
            return DefaultRegions[0];
        }

        console.log(`Selected region with ID: ${regionId}`);

        return selected;
    }, [regions, regionId]);

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
        dispatch(setRegion(id))
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