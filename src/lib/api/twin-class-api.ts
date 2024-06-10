import {ApiSettings, getApiDomainHeaders} from "@/lib/api/api";
import {PaginationState} from "@tanstack/table-core";
import {TwinClassCreateRequestBody} from "@/lib/api/api-types";

export function createTwinClassApi(settings: ApiSettings) {

    function search({pagination, search}: {pagination: PaginationState, search?: string}) {
        return settings.client.POST('/private/twin_class/search/v1', {
            params: {
                header: getApiDomainHeaders(settings),
                query: {
                    showClassMode: 'DETAILED',
                    showStatusMode: 'SHORT',
                    limit: pagination.pageSize,
                    offset: pagination.pageIndex * pagination.pageSize
                }
            },
            body: {
                twinClassKeyLikeList: search ? ['%' + search + '%'] : undefined
            }
        })
    }

    function create({body}: {body: TwinClassCreateRequestBody}) {
        return settings.client.POST('/private/twin_class/v1', {
            params: {
                header: getApiDomainHeaders(settings),
            },
            body: body
        })
    }

    return {search, create}
}

export type TwinClassApi = ReturnType<typeof createTwinClassApi>;