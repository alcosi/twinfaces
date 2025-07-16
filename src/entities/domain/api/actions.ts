"use server";

import { getAuthHeaders } from "@/entities/face";
import { TwinsAPI } from "@/shared/api";
import { RemoteConfig } from "@/shared/config";
import { isUndefined } from "@/shared/libs";

import { DomainPublicView, DomainViewRs } from "./types";

export async function fetchDomainByKey(
  domainKey: string
): Promise<RemoteConfig | undefined> {
  const { data } = await TwinsAPI.GET("/public/domain_by_key/{domainKey}/v1", {
    params: {
      path: { domainKey },
      query: { showDomainMode: "DETAILED" },
    },
  });
  return data?.domain;
}

export async function fetchCurrentDomain(): Promise<DomainViewRs> {
  const { DomainId, AuthToken, Channel } = await getAuthHeaders();

  const { data } = await TwinsAPI.GET("/private/domain/{domainId}/v1", {
    params: {
      path: { domainId: DomainId },
      header: { AuthToken, Channel, DomainId },
      query: {
        lazyRelation: false,
        showDomainMode: "DETAILED",
        showDomainNavbar2FaceMode: "DETAILED",
      },
    },
  });

  if (isUndefined(data)) throw new Error("Failed to fetch domain");

  return data;
}

export async function fetchDomainsList() {
  const { DomainId, AuthToken, Channel } = await getAuthHeaders();

  const { data } = await TwinsAPI.GET("/private/domain/list/v1", {
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
  const { data } = await TwinsAPI.POST(`/public/domain/search/v1`, {
    params: {
      query: {
        lazyRelation: false,
        showDomainMode: "DETAILED",
      },
    },
    body: { search: {} },
  });

  if (isUndefined(data?.domains))
    throw new Error("Failed to fetch domain list");

  return data.domains;
}
