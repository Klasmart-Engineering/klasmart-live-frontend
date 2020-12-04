import { useCallback, useState } from "react";

export type Service = "auth" | "live" | "scheduler" | "sfu"

export type Region = {
    id: string,
    name: string,
    development: boolean,
    services: Record<Service, string>,
}

const REGIONS_DEFINITION_FILE = process.env.REGIONS_DEFINITION_FILE || "";

export function useRegionSelection() {
    const [regions, setRegions] = useState<Region[]>();
    const [region, setRegion] = useState<Region>();

    const fetchRegions = useCallback(async () => {
        const headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("Content-Type", "application/json");

        const response = await fetch(REGIONS_DEFINITION_FILE, {
            headers,
            method: "GET",
        });

        // TODO: Better typesafe way to retrieve the regions array, perhaps 
        // with data validation framework?
        const { regions } : { regions: Region[] } = await response.json();

        setRegions(regions);
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

    return {region, regions, selectRegion, fetchRegions};
}