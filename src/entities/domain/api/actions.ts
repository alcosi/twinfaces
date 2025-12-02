"use server";

import { Client } from "openapi-fetch";

import { getAuthHeaders } from "@/entities/face";
import { apiFromRequest } from "@/entities/user/server";
import { paths } from "@/shared/api/generated/schema";
import { RemoteConfig } from "@/shared/config";
import { isUndefined } from "@/shared/libs";

import { DomainPublicView, DomainViewRs } from "./types";

type ShowMode = "DETAILED" | "HIDE" | "SHORT";
type Args = {
  showDomainMode?: ShowMode;
};

export async function fetchDomainByKey(
  api: Client<paths>,
  domainKey: string,
  { showDomainMode = "DETAILED" }: Args
): Promise<RemoteConfig | undefined> {
  const { data, error } = await api.GET(
    "/public/domain_by_key/{domainKey}/v1",
    {
      params: {
        path: { domainKey: domainKey ?? "" },
        query: { showDomainMode },
      },
      cache: "no-store",
    }
  );
  if (error) throw error;

  return (data as DomainViewRs | undefined)?.domain;
}

export const fetchDomainByKeyDefault = async (
  domainKey: string,
  args: Args
) => {
  const api = await apiFromRequest();
  return fetchDomainByKey(api, domainKey, args);
};

export async function fetchCurrentDomain(): Promise<DomainViewRs> {
  const { DomainId, AuthToken, Channel } = await getAuthHeaders();
  const api = await apiFromRequest();

  const { data, error } = await api.GET("/private/domain/{domainId}/v1", {
    params: {
      path: { domainId: DomainId },
      header: { AuthToken, Channel, DomainId },
      query: {
        lazyRelation: false,
        showDomainMode: "DETAILED",
        showDomainNavbar2FaceMode: "DETAILED",
      },
    },
    cache: "no-store",
  });

  if (error) throw error;
  if (isUndefined(data)) throw new Error("Failed to fetch domain");

  return data;
}

export async function fetchDomainsList() {
  const { DomainId, AuthToken, Channel } = await getAuthHeaders();
  const api = await apiFromRequest();

  const { data } = await api.GET("/private/domain/list/v1", {
    params: {
      header: { AuthToken, Channel, DomainId },
      query: {
        showDomainMode: "DETAILED",
      },
    },
  });

  if (isUndefined(data)) throw new Error("Failed to fetch domains list");

  return data;
}

export async function fetchDomains(): Promise<DomainPublicView[]> {
  const api = await apiFromRequest();
  const { data, error } = await api.POST("/public/domain/search/v1", {
    params: {
      query: {
        lazyRelation: false,
        showDomainMode: "DETAILED",
      },
    },
    body: { search: {} },
    cache: "no-store",
  });
  console.log("🚀 ~ fetchDomains ~ data:", data);
  console.log("🚀 ~ fetchDomains ~ error:", error);

  if (error) throw error;
  if (isUndefined(data?.domains))
    throw new Error("Failed to fetch domain list");
  return data.domains;
}
