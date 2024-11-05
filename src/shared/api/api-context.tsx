"use client";

import createClient from "openapi-fetch";
import { createContext } from "react";
import { paths } from "./generated/schema";
// Note: Consider restructuring to avoid importing from a higher level
import { ApiContextProps } from "@/features/api-context-provider";

export const ApiContext = createContext<ApiContextProps>({} as ApiContextProps);

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
