import { selectedRegionState } from "@/app/model/appModel";
import { FeatureFlag } from "@/providers/feature-context";
import React, {
    createContext,
    ReactChild,
    ReactChildren,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useRecoilState } from "recoil";

export type Service = "auth" | "live" | "cms" | "sfu" | "user" | "privacy" | "pdf" | "cookies" | "contact" | "terms";

export type Region = {
    id: string;
    name: string;
    development: boolean;
    services: Record<Service, string>;
    features: FeatureFlag[];
}

export interface IRegionSelectContext {
    regions?: Region[];
    region?: Region;
    selectRegion?: (id: string) => void;
    loading: boolean;
}

type Props = {
    children?: ReactChild | ReactChildren | null;
    regionsUrl?: string;
}

const RegionSelectContext = createContext<IRegionSelectContext>({
    loading: false,
});

const DefaultRegions: Region[] = [
    {
        id: `auth.kidsloop.live`,
        name: `Live Global`,
        development: false,
        services: {
            auth: `https://auth.kidsloop.live`,
            live: `https://live.kidsloop.live`,
            cms: `https://cms.kidsloop.live`,
            sfu: `https://live.kidsloop.live/sfu`,
            user: `https://api.kidsloop.live/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.kidsloop.live/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [],
    },
    {
        id: `auth.kidsloop.net`,
        name: `Live Global (Old)`,
        development: false,
        services: {
            auth: `https://auth.kidsloop.live`,
            live: `https://live.kidsloop.live`,
            cms: `https://cms.kidsloop.live`,
            sfu: `https://live.kidsloop.live/sfu`,
            user: `https://api.kidsloop.live/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.kidsloop.live/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [],
    },
    {
        id: `auth.kidsloop.co.uk`,
        name: `UK`,
        development: false,
        services: {
            auth: `https://auth.kidsloop.co.uk`,
            live: `https://live.kidsloop.co.uk`,
            cms: `https://kl2.kidsloop.co.uk`,
            sfu: `https://live.kidsloop.co.uk/sfu`,
            user: `https://api.kidsloop.co.uk/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.kidsloop.co.uk/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [],
    },
    {
        id: `auth.kidsloop.in`,
        name: `India`,
        development: false,
        services: {
            auth: `https://auth.kidsloop.in`,
            live: `https://live.kidsloop.in`,
            cms: `https://cms.kidsloop.in`,
            sfu: `https://live.kidsloop.in/sfu`,
            user: `https://api.kidsloop.in/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.kidsloop.in/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [],
    },
    {
        id: `auth.kidsloop.id`,
        name: `Indonesia`,
        development: false,
        services: {
            auth: `https://auth.kidsloop.id`,
            live: `https://live.kidsloop.id`,
            cms: `https://cms.kidsloop.id`,
            sfu: `https://live.kidsloop.id/sfu`,
            user: `https://api.kidsloop.id/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.kidsloop.id/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [],
    },
    {
        id: `auth.kidsloop.cn`,
        name: `China`,
        development: false,
        services: {
            auth: `https://auth.kidsloop.cn`,
            live: `https://live.kidsloop.cn`,
            cms: `https://kl2.kidsloop.cn`,
            sfu: `https://live.kidsloop.cn/sfu`,
            user: `https://api.kidsloop.cn/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.kidsloop.cn/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [],
    },
    {
        id: `auth.kidsloop.vn`,
        name: `Vietnam`,
        development: false,
        services: {
            auth: `https://auth.kidsloop.vn`,
            live: `https://live.kidsloop.vn`,
            cms: `https://cms.kidsloop.vn`,
            sfu: `https://live.kidsloop.vn/sfu`,
            user: `https://api.kidsloop.vn/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.kidsloop.vn/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [ FeatureFlag.ONLY_OBSERVE_IN_VIEWPORT ],
    },
    {
        id: `auth.kidsloop.lk`,
        name: `Sri Lanka`,
        development: false,
        services: {
            auth: `https://auth.kidsloop.lk`,
            live: `https://live.kidsloop.lk`,
            cms: `https://cms.kidsloop.lk`,
            sfu: `https://live.kidsloop.lk/sfu`,
            user: `https://api.kidsloop.lk/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.kidsloop.lk/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [],
    },
    {
        id: `auth.kidsloop.co.th`,
        name: `Thai`,
        development: false,
        services: {
            auth: `https://auth.kidsloop.co.th`,
            live: `https://live.kidsloop.co.th`,
            cms: `https://cms.kidsloop.co.th`,
            sfu: `https://live.kidsloop.co.th/sfu`,
            user: `https://api.kidsloop.co.th/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.kidsloop.co.th/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [],
    },
    {
        id: `auth.kidsloop.pk`,
        name: `Pakistan`,
        development: false,
        services: {
            auth: `https://auth.kidsloop.pk`,
            live: `https://live.kidsloop.pk`,
            cms: `https://cms.kidsloop.pk`,
            sfu: `https://live.kidsloop.pk/sfu`,
            user: `https://api.kidsloop.pk/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.kidsloop.pk/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [ FeatureFlag.ONLY_OBSERVE_IN_VIEWPORT ],
    },
    {
        id: `auth.stage.kidsloop.live`,
        name: `Staging`,
        development: true,
        services: {
            auth: `https://auth.stage.kidsloop.live`,
            live: `https://live.stage.kidsloop.live`,
            cms: `https://cms.stage.kidsloop.live`,
            sfu: `https://live.stage.kidsloop.live/sfu`,
            user: `https://api.stage.kidsloop.live/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.stage.kidsloop.live/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [],
    },
    {
        id: `auth.alpha.kidsloop.net`,
        name: `Alpha`,
        development: true,
        services: {
            auth: `https://auth.alpha.kidsloop.net`,
            live: `https://live.alpha.kidsloop.net`,
            cms: `https://cms.alpha.kidsloop.net`,
            sfu: `https://live.alpha.kidsloop.net/sfu`,
            user: `https://api.alpha.kidsloop.net/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.alpha.kidsloop.net/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [ FeatureFlag.ONLY_OBSERVE_IN_VIEWPORT ],
    },
    {
        id: `auth.alpha.kidsloop.dev`,
        name: `Global Alpha`,
        development: true,
        services: {
            auth: `https://auth.alpha.kidsloop.dev`,
            live: `https://live.alpha.kidsloop.dev`,
            cms: `https://cms.alpha.kidsloop.dev`,
            sfu: `https://live.alpha.kidsloop.dev/sfu`,
            user: `https://api.alpha.kidsloop.dev/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.alpha.kidsloop.net/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [ FeatureFlag.ONLY_OBSERVE_IN_VIEWPORT ],
    },
    {
        id: `auth.sso.kidsloop.live`,
        name: `SSO`,
        development: true,
        services: {
            auth: `https://auth.sso.kidsloop.live`,
            live: `https://live.sso.kidsloop.live`,
            cms: `https://cms.sso.kidsloop.live`,
            sfu: `https://live.sso.kidsloop.live/sfu`,
            user: `https://api.sso.kidsloop.live/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.sso.kidsloop.live/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [ FeatureFlag.ONLY_OBSERVE_IN_VIEWPORT ],
    },
    {
        id: `auth.beta.kidsloop.id`,
        name: `Indonesia Beta`,
        development: true,
        services: {
            auth: `https://auth.beta.kidsloop.id`,
            live: `https://live.beta.kidsloop.id`,
            cms: `https://cms.beta.kidsloop.id`,
            sfu: `https://live.beta.kidsloop.id/sfu`,
            user: `https://api.beta.kidsloop.id/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.beta.kidsloop.id/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [ FeatureFlag.ONLY_OBSERVE_IN_VIEWPORT ],
    },
    {
        id: `auth.beta.kidsloop.vn`,
        name: `Vietnam Beta`,
        development: true,
        services: {
            auth: `https://auth.beta.kidsloop.vn`,
            live: `https://live.beta.kidsloop.vn`,
            cms: `https://cms.beta.kidsloop.vn`,
            sfu: `https://live.beta.kidsloop.vn/sfu`,
            user: `https://api.beta.kidsloop.vn/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.beta.kidsloop.vn/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [ FeatureFlag.ONLY_OBSERVE_IN_VIEWPORT ],
    },
    {
        id: `auth.research.kidsloop.live`,
        name: `R&D Korea`,
        development: true,
        services: {
            auth: `https://auth.research.kidsloop.live`,
            live: `https://live.research.kidsloop.live`,
            cms: `https://cms.research.kidsloop.live`,
            sfu: `https://live.research.kidsloop.live/sfu`,
            user: `https://api.research.kidsloop.live/user/`,
            privacy: `https://kidsloop.net/policies/privacy-notice`,
            pdf: `https://live.research.kidsloop.live/pdf`,
            cookies: `https://kidsloop.net/cookies-policy/`,
            contact: `https://kidsloop.net/contact-us/`,
            terms: `https://kidsloop.net/en/policies/terms/`,
        },
        features: [ FeatureFlag.ONLY_OBSERVE_IN_VIEWPORT ],
    },
];

function createRegionFromEnvironment (): Region {
    const hostWithOrigin = `${window.location.protocol}//${window.location.host}`;

    return(
        {
            id: `env`,
            name: `Environment`,
            development: false,
            services: {
                auth: `${process.env.LOGIN_PAGE_URL}`,
                live: `${process.env.ENDPOINT_LIVE || hostWithOrigin}`,
                cms: `${process.env.ENDPOINT_CMS}`,
                sfu: `${process.env.ENDPOINT_SFU || hostWithOrigin}/sfu`,
                user: `${process.env.ENDPOINT_API || hostWithOrigin}/user/`,
                privacy: `https://kidsloop.net/en/policies/privacy-notice`,
                pdf: `${process.env.ENDPOINT_API || hostWithOrigin}/pdf/`,
                cookies: `https://kidsloop.net/cookies-policy/`,
                contact: `https://kidsloop.net/contact-us/`,
                terms: `https://kidsloop.net/en/policies/terms/`,
            },
            features: [ process.env.ONLY_OBSERVE_IN_VIEWPORT === `TRUE` ? FeatureFlag.ONLY_OBSERVE_IN_VIEWPORT : FeatureFlag.NONE ],
        }
    );
}

export function RegionSelectProvider ({ children, regionsUrl }: Props) {
    const [ regions, setRegions ] = useState<Region[]>(DefaultRegions);
    const [ loading, setLoading ] = useState<boolean>(false);
    const [ selectedRegion, setSelectedRegion ] = useRecoilState(selectedRegionState);

    const region = useMemo<Region>(() => {
        if(selectedRegion.regionId === `env`){return createRegionFromEnvironment();}

        if (!regions) {
            console.error(`Can't select region with ID: ${selectedRegion.regionId}. No regions available. Falling back to default.`);
            return DefaultRegions[0];
        }

        const selected = regions.find(region => region.id === selectedRegion.regionId);
        if (selected === undefined) {
            console.error(`Can't select region with ID: ${selectedRegion.regionId}. No region with ID. Falling back to default.`);
            return DefaultRegions[0];
        }

        console.log(`Selected region with ID: ${selectedRegion.regionId}`);

        return selected;
    }, [ regions, selectedRegion ]);

    const fetchRegions = useCallback(async () => {
        if (!regionsUrl) return;

        setLoading(true);

        const headers = new Headers();
        headers.append(`Accept`, `application/json`);
        headers.append(`Content-Type`, `application/json`);

        const response = await fetch(regionsUrl, {
            headers,
            method: `GET`,
        });

        // TODO: Better typesafe way to retrieve the regions array, perhaps with data validation framework?
        const { regions }: { regions: Region[] } = await response.json();

        setRegions(regions);
        setLoading(false);
    }, []);

    useEffect(() => {
        if(!regionsUrl) return;
        fetchRegions();
    }, [ regionsUrl ]);

    const selectRegion = useCallback((id: string) => {
        setSelectedRegion({
            regionId: id,
        });
    }, []);

    return (
        <RegionSelectContext.Provider value={{
            regions,
            region,
            selectRegion,
            loading,
        }}
        >
            { children}
        </RegionSelectContext.Provider>
    );
}

export function useRegionSelect () {
    return useContext(RegionSelectContext);
}

export function useWebsocketEndpoint (service: Service) {
    const { region } = useRegionSelect();

    const endpoint = useMemo(() => {
        if (!region) return ``;

        const serviceEndpoint = region.services[service];
        return serviceEndpoint
            .replace(`https://`, `wss://`)
            .replace(`http://`, `ws://`);
    }, [ region, service ]);

    return endpoint;
}

export function useHttpEndpoint (service: Service) {
    const { region } = useRegionSelect();

    const endpoint = useMemo(() => {
        if (!region) return ``;

        const serviceEndpoint = region.services[service];
        return serviceEndpoint
            .replace(`wss://`, `https://`)
            .replace(`ws://`, `http://`);
    }, [ region, service ]);

    return endpoint;
}
