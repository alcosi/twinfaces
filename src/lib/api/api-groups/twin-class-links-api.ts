import { CreateLinkRequestBody } from "@/entities/twinClassLink";
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

  return { getLinks, create };
}

export type TwinClassLinkApi = ReturnType<typeof createTwinClassLinksApi>;
