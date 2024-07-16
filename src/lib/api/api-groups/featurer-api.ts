import {ApiSettings, getApiDomainHeaders} from "@/lib/api/api";
import {PaginationState} from "@tanstack/table-core";
import {operations} from "@/lib/api/generated/schema";


export function createFeaturerApi(settings: ApiSettings) {
    type SearchOptions = operations["featurerListV1"]["requestBody"]["content"]["application/json"]

    function search({pagination, options}: { pagination: PaginationState, options: SearchOptions }) {
        return settings.client.POST('/private/featurer/v1', {
            params: {
                header: getApiDomainHeaders(settings),
                query: {
                    limit: pagination.pageSize,
                    offset: pagination.pageIndex * pagination.pageSize,
                    showFeaturerMode: 'DETAILED',
                    showFeaturerParamMode: 'SHOW',
                }
            },
            body: options
        })
    }

    return {search}
}

export type FeaturerApi = ReturnType<typeof createFeaturerApi>;