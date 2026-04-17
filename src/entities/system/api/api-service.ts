import { ApiSettings, getApiDomainHeaders } from "@/shared/api";

export function createSystemApi(settings: ApiSettings) {
  function dropCaches() {
    return settings.client.GET("/private/system/cache/all/evict", {
      params: {
        header: getApiDomainHeaders(settings),
      },
    });
  }

  return { dropCaches };
}

export type SystemApi = ReturnType<typeof createSystemApi>;
