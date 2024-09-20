import {ApiSettings} from "@/lib/api/api";
import {operations} from "@/lib/api/generated/schema";

export type GetDomainQuery = operations["domainListV1"]["parameters"]["query"]

export function createDomainApi(settings: ApiSettings) {
    function getAll({query}:{query: GetDomainQuery}) {
        return settings.client.GET('/private/domain/list/v1', {
            params: {
                header: {
                    AuthToken: settings.authToken,
                    Channel: settings.channel
                },
                query: query
            }
        })
    }

    return {getAll}
}

export type DomainApi = ReturnType<typeof createDomainApi>