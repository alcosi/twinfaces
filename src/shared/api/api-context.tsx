"use client";

import createClient from "openapi-fetch";
import { createContext } from "react";

// eslint-disable-next-line fsd-import/layer-imports
import { PrivateApiContextProps, PublicApiContextProps } from "@/features/api";

import { paths } from "./generated/schema";

export const PrivateApiContext = createContext<PrivateApiContextProps>(
  {} as PrivateApiContextProps
);

export const PublicApiContext = createContext<PublicApiContextProps>(
  {} as PublicApiContextProps
);

export interface ApiSettings {
  domain: string;
  authToken: string;
  channel: string;
  client: ReturnType<typeof createClient<paths>>;
}

export function getApiDomainHeaders(settings: ApiSettings) {
  return {
    DomainId: settings.domain,
    AuthToken: settings.authToken,
    Channel: settings.channel,
  };
}
