import {ApiSettings, getApiDomainHeaders} from "@/lib/api/api";
import {PaginationState} from "@tanstack/table-core";
import {TwinClassCreateRq, TwinClassFieldCreateRq} from "@/lib/api/api-types";
import {operations} from "@/lib/api/generated/schema";

export function createTwinClassApi(settings: ApiSettings) {

    function search({pagination, search}: { pagination: PaginationState, search?: string }) {
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

    function getByKey({key, query = {}}: { key: string, query: operations['twinClassViewByKeyV1']['parameters']['query'] }) {
        return settings.client.GET(`/private/twin_class_by_key/{twinClassKey}/v1`, {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinClassKey: key},
                query: query
            }
        })
    }

    function getById({id, query = {}}: { id: string, query: operations['twinClassViewV1']['parameters']['query'] }) {
        return settings.client.GET(`/private/twin_class/{twinClassId}/v1`, {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinClassId: id},
                query: query
            }
        })
    }

    function getFields({id}: { id: string }) {
        return settings.client.GET(`/private/twin_class/{twinClassId}/field/list/v1`, {
            params: {
                header: getApiDomainHeaders(settings),
                query: {
                    showClassFieldMode: "DETAILED"
                },
                path: {twinClassId: id}
            }
        })
    }

    function create({body}: { body: TwinClassCreateRq }) {
        return settings.client.POST('/private/twin_class/v1', {
            params: {
                header: getApiDomainHeaders(settings),
            },
            body: body
        })
    }

    function createField({id, body}: { id: string, body: TwinClassFieldCreateRq }) {
        return settings.client.POST(`/private/twin_class/{twinClassId}/field/v1`, {
            params: {
                header: getApiDomainHeaders(settings),
                path: {
                    twinClassId: id
                },
            },
            body: body
        })
    }

    return {search, getByKey, getById, getFields, create, createField}
}

export type TwinClassApi = ReturnType<typeof createTwinClassApi>;