import { ApiSettings, getApiDomainHeaders } from "@/lib/api/api";
import { TwinLinkAddRqV1 } from "@/lib/api/api-types";

export function createTwinLinksApi(settings: ApiSettings) {

    function getLinks({ twinClassId }: { twinClassId: string }) {
        return settings.client.GET("/private/twin_class/{twinClassId}/link/v1", {
            params: {
                header: getApiDomainHeaders(settings),
                path: { twinClassId },
                query: {
                    showLinkDst2TwinClassMode: 'MANAGED',
                    showLinkMode: 'DETAILED',
                }
            }
        });
    }

    async function create({ twinId, body }: { twinId: string; body: TwinLinkAddRqV1 }) {
        return settings.client.POST("/private/twin/{twinId}/link/v1", {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinId}
            },
            body: body
        });
    }

    return { getLinks, create };
}

export type TwinLinkApi = ReturnType<typeof createTwinLinksApi>;
