"use server";

import { TwinsAPI } from "@/shared/api";
import { RemoteConfig } from "@/shared/config";
import { isUndefined } from "@/shared/libs";

import { DomainViewRs } from "..";

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

export async function fetchDomainById(domainId: string): Promise<DomainViewRs> {
  const { data } = await TwinsAPI.GET("/private/domain/{domainId}/v1", {
    params: {
      path: { domainId },
      header: {
        AuthToken: "608c6d7d-99c8-4d87-89c6-2f72d0f5d673",
        Channel: "WEB",
      },
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
