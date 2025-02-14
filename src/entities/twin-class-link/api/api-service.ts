import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

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

  return { getLinks };
}

export type TwinClassLinkApi = ReturnType<typeof createTwinClassLinksApi>;
