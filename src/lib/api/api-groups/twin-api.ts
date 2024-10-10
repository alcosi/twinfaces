import {ApiSettings, getApiDomainHeaders} from "@/lib/api/api";
import {PaginationState} from "@tanstack/table-core";
import {components} from "@/lib/api/generated/schema";

type TwinSearchApiFilters = Partial<Pick<components["schemas"]["TwinSearchRqV1"],
    | 'twinIdList'
    | 'twinNameLikeList'
    | 'twinClassIdList'
    | 'assignerUserIdList'
>>

export function createTwinApi(settings: ApiSettings) {

    function search({pagination, search, filters}: {
        pagination: PaginationState,
        search?: string,
        filters?: TwinSearchApiFilters
    }) {
        console.log("createTwinApi", search);
        return settings.client.POST('/private/twin/search/v3', {
            params: {
                header: getApiDomainHeaders(settings),
                query: {
                    showTwinMode: "DETAILED",
                    showTwinClassMode: "DETAILED",
                    offset: pagination.pageIndex * pagination.pageSize,
                    limit: pagination.pageSize,
                    sortAsc: false
                },
            },
            body: [{
                ...filters,
            }]
        });
    }

    return {search}
}

export type TwinApi = ReturnType<typeof createTwinApi>;