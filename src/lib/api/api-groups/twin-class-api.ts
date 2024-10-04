import {ApiSettings, getApiDomainHeaders} from "@/lib/api/api";
import {PaginationState} from "@tanstack/table-core";
import {
    TwinClassCreateRq,
    TwinClassField,
    TwinClassFieldCreateRq,
    TwinClassFieldUpdateRq,
    TwinClassUpdateRq
} from "@/lib/api/api-types";
import {components, operations} from "@/lib/api/generated/schema";

type TwinClassApiFilters = Partial<Pick<components["schemas"]["TwinClassListRqV1"],
    | 'twinClassIdList'
    | 'twinClassKeyLikeList'
    | 'nameI18nLikeList'
    | 'descriptionI18nLikeList'
    | 'twinflowSchemaSpace'
    | 'twinClassSchemaSpace'
    | 'permissionSchemaSpace'
    | 'aliasSpace'
    | 'abstractt'
>>

export function createTwinClassApi(settings: ApiSettings) {

    function search({
        pagination,
        search, 
        filters,
    }: {
        pagination: PaginationState,
        search?: string,
        filters: TwinClassApiFilters
    }) {
        return settings.client.POST('/private/twin_class/search/v1', {
            params: {
                header: getApiDomainHeaders(settings),
                query: {
                    showTwinClassMode: 'DETAILED',
                    limit: pagination.pageSize,
                    offset: pagination.pageIndex * pagination.pageSize
                }
            },
            body: {
                twinClassKeyLikeList: search ? ['%' + search + '%'] : undefined,
                ...filters,
                ownerType: 'DOMAIN'
            }
        })
    }

    function getByKey({key, query = {}}: {
        key: string,
        query: operations['twinClassViewByKeyV1']['parameters']['query']
    }) {
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
                    showTwinClassFieldMode: "MANAGED",
                    showTwinClass2TwinClassFieldMode: "MANAGED",
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

    function update({id, body}: { id: string, body: TwinClassUpdateRq }) {
        return settings.client.PUT('/private/twin_class/{twinClassId}/v1', {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinClassId: id}
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

    function updateField({fieldId, body}: { fieldId: string, body: TwinClassFieldUpdateRq }) {
        return settings.client.PUT('/private/twin_class_field/{twinClassFieldId}/v1', {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinClassFieldId: fieldId}
            },
            body
        })
    }

    function getStatusById({ twinStatusId }: { twinStatusId: string }) {
        return settings.client.GET(`/private/twin_status/{twinStatusId}/v1`, {
            params: {
                header: getApiDomainHeaders(settings),
                path: { twinStatusId },
                query: {
                    showStatusMode: "DETAILED",
                }
            }
        });
    }

    function getFieldById({fieldId}: { fieldId: string }) {
        return settings.client.GET("/private/twin_class_field/{twinClassFieldId}/v1", {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinClassFieldId: fieldId},
                query: {
                    showLinkDst2TwinClassMode: "MANAGED",
                    showTwin2StatusMode: "DETAILED",
                    showTwin2TwinClassMode: "MANAGED",
                    showTwin2UserMode: "DETAILED",
                    showTwinAliasMode: "DETAILED",
                    showTwinByHeadMode: "WHITE",
                    showTwinClass2LinkMode: "DETAILED",
                    showTwinClass2StatusMode: "DETAILED",
                    showTwinClass2TwinClassFieldMode: "MANAGED",
                    showTwinClassExtends2TwinClassMode: "MANAGED",
                    showTwinClassFieldDescriptor2DataListOptionMode: "DETAILED",
                    showTwinClassFieldDescriptor2TwinMode: "DETAILED",
                    showTwinClassFieldDescriptor2UserMode: "DETAILED",
                    showTwinClassFieldMode: "MANAGED",
                    showTwinClassHead2TwinClassMode: "MANAGED",
                    showTwinClassMarker2DataListOptionMode: "DETAILED",
                    showTwinClassMode: "MANAGED",
                    showTwinClassTag2DataListOptionMode: "DETAILED"
                }
            }
        })
    }

    function getLinks({twinClassId}: { twinClassId: string}) {
        return settings.client.GET("/private/twin_class/{twinClassId}/link/v1", {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinClassId},
                query: {
                    showLinkDst2TwinClassMode: 'MANAGED',
                    showLinkMode: 'DETAILED',
                }
            }
        });
    }

    return {search, getByKey, getById, getFields, getFieldById, create, update, createField, updateField, getLinks, getStatusById}
}

export type TwinClassApi = ReturnType<typeof createTwinClassApi>;