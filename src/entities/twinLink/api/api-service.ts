import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createTwinLinksApi(settings: ApiSettings) {
  function getLinks({ twinId }: { twinId: string }) {
    return settings.client.GET("/private/twin/{twinId}/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId: twinId },
        query: {
          showTwin2TwinLinkMode: "DETAILED",
          showTwinLink2UserMode: "DETAILED",
          showTwinLink2LinkMode: "DETAILED",
          showTwinField2TwinMode: "DETAILED",
          showTwinByLinkMode: "GREEN",
        },
      },
    });
  }

  return { getLinks };
}

export type TwinLinkApi = ReturnType<typeof createTwinLinksApi>;
