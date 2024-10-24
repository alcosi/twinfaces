import {
  CreateLinkRequestBody,
  UpdateLinkRequestBody,
} from "@/entities/twinClassLink";
import { ApiSettings, getApiDomainHeaders } from "@/lib/api/api";

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

  async function create({ body }: { body: CreateLinkRequestBody }) {
    return settings.client.POST("/private/link/v1", {
      params: {
        header: getApiDomainHeaders(settings),
      },
      body: body,
    });
  }

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

  return { getLinks, create, update };
}

export type TwinClassLinkApi = ReturnType<typeof createTwinClassLinksApi>;
