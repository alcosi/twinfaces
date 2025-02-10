import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { QueryLinkViewV1, UpdateLinkRequestBody } from "./types";

export function createTwinClassLinksApi(settings: ApiSettings) {
  const getLinks = async ({ twinClassId }: { twinClassId: string }) => {
    return settings.client.GET("/private/twin_class/{twinClassId}/link/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinClassId },
        query: {
          showLinkDst2TwinClassMode: "MANAGED",
          showLinkMode: "DETAILED",
        },
      },
    });
  };

  async function update({
    linkId,
    body,
  }: {
    linkId: string;
    body: UpdateLinkRequestBody;
  }) {
    return settings.client.PUT("/private/link/{linkId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { linkId },
      },
      body: body,
    });
  }

  function getById({
    linkId,
    query = {},
  }: {
    linkId: string;
    query: QueryLinkViewV1;
  }) {
    return settings.client.GET("/private/link/{linkId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { linkId },
        query: query,
      },
    });
  }

  return { getLinks, update, getById };
}

export type TwinClassLinkApi = ReturnType<typeof createTwinClassLinksApi>;
