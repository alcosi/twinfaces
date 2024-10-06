'use client';

import {createContext} from "react";
import {createTwinClassApi, TwinClassApi} from "@/lib/api/api-groups/twin-class-api";
import createClient from "openapi-fetch";
import {paths} from "@/lib/api/generated/schema";
import {env} from "next-runtime-env";
import {createTwinStatusApi, TwinStatusApi} from "@/lib/api/api-groups/twin-status-api";
import {createFeaturerApi, FeaturerApi} from "@/lib/api/api-groups/featurer-api";
import {createTwinflowApi, TwinflowApi} from "@/lib/api/api-groups/twinflow-api";

export interface ApiContextProps {
    twinClass: TwinClassApi
    twinStatus: TwinStatusApi
    twinflow: TwinflowApi
    featurer: FeaturerApi
}

export const ApiContext = createContext<ApiContextProps>({} as ApiContextProps);

export interface ApiSettings {
    domain: string,
    authToken: string,
    channel: string,
    client: ReturnType<typeof createClient<paths>>
}

export function getApiDomainHeaders(settings: ApiSettings) {
    return {
        DomainId: settings.domain,
        AuthToken: settings.authToken,
        Channel: settings.channel
    }
}

export function ApiContextProvider({children}: { children: React.ReactNode }) {
    const settings: ApiSettings = {
        domain: env('NEXT_PUBLIC_DOMAIN') ?? "",
        authToken: env('NEXT_PUBLIC_AUTH_TOKEN') ?? "",
        channel: env('NEXT_PUBLIC_CHANNEL') ?? "",
        client: createClient<paths>({baseUrl: env('NEXT_PUBLIC_TWINS_API_URL')})
    }

    return <ApiContext.Provider value={{
        twinClass: createTwinClassApi(settings),
        twinStatus: createTwinStatusApi(settings),
        twinflow: createTwinflowApi(settings),
        featurer: createFeaturerApi(settings)
    }}>
        {children}
    </ApiContext.Provider>
}