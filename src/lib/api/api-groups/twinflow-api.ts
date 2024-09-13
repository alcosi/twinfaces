import {ApiSettings, getApiDomainHeaders} from "@/lib/api/api";
import {
    TwinFlowCreateRq,
    TwinFlowTransitionCreateRq,
    TwinFlowTransitionUpdateRq,
    TwinFlowUpdateRq
} from "@/lib/api/api-types";
import {PaginationState} from "@tanstack/table-core";

export function createTwinflowApi(settings: ApiSettings) {
    // function create({twinClassId, data}: { twinClassId: string, data: TwinClassStatusCreateRq }) {
    //     return settings.client.POST('/private/twin_class/{twinClassId}/twin_status/v1', {
    //         params: {
    //             header: getApiDomainHeaders(settings),
    //             path: {twinClassId: twinClassId}
    //         },
    //         body: data
    //     })
    // }

    // function update({statusId, data}: { statusId: string, data: TwinClassStatusUpdateRq }) {
    //     return settings.client.PUT('/private/twin_status/{twinStatusId}/v1', {
    //         params: {
    //             header: getApiDomainHeaders(settings),
    //             path: {twinStatusId: statusId}
    //         },
    //         body: data
    //     })
    // }

    function search({twinClassId, pagination, search, nameFilter, abstractFilter}: {
        twinClassId: string,
        pagination: PaginationState,
        search?: string,
        nameFilter?: string,
        abstractFilter?: boolean
    }) {

        var abstract: "ANY" | "ONLY" | "ONLY_NOT" = "ANY";
        if (abstractFilter !== undefined) {
            abstract = abstractFilter ? "ONLY" : "ONLY_NOT";
        }

        return settings.client.POST("/private/twinflow/search/v1", {
            params: {
                header: getApiDomainHeaders(settings),
                query: {
                    showTwinflowMode: 'DETAILED',
                    showTwinflow2TransitionMode: 'DETAILED',
                    showTransition2StatusMode: 'SHORT',
                    showTwinflowInitStatus2StatusMode: 'SHORT',
                    offset: pagination.pageIndex * pagination.pageSize,
                    limit: pagination.pageSize
                }
            },
            body: {
                twinClassIdList: [twinClassId],
                twinClassKeyLikeList: search ? ['%' + search + '%'] : undefined,
                nameI18nLikeList: nameFilter ? ['%' + nameFilter + '%'] : undefined,
                abstractt: abstract,
            }
        })
    }

    function getById({twinFlowId}: { twinFlowId: string }) {
        return settings.client.GET("/private/twinflow/{twinflowId}/v1", {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinflowId: twinFlowId},
                query: {
                    showTwinflowMode: 'DETAILED',
                    showTwinflow2TransitionMode: 'DETAILED',
                    showTransition2StatusMode: 'SHORT',
                    showTwinflowInitStatus2StatusMode: 'SHORT',
                }
            },
        })
    }

    function create({twinClassId, body}: { twinClassId: string, body: TwinFlowCreateRq }) {
        return settings.client.POST("/private/twin_class/{twinClassId}/twinflow/v1", {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinClassId}
            },
            body: body
        })
    }

    function update({id, body}: { id: string, body: TwinFlowUpdateRq }) {
        return settings.client.PUT("/private/twinflow/{twinflowId}/v1", {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinflowId: id}
            },
            body
        })
    }


    function getTransitionById({transitionId}: { transitionId: string }) {
        return settings.client.GET("/private/transition/{transitionId}/v1", {
            params: {
                header: getApiDomainHeaders(settings),
                path: {transitionId},
                query: {
                    showTransitionMode: 'MANAGED',
                    showTransition2StatusMode: 'DETAILED'
                }
            },
        })
    }

    function createTransition({twinFlowId, data}: { twinFlowId: string, data: TwinFlowTransitionCreateRq }) {
        return settings.client.POST("/private/twinflow/{twinflowId}/transition/v1", {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinflowId: twinFlowId}
            },
            body: data
        })
    }

    function updateTransition({transitionId, data}: { transitionId: string, data: TwinFlowTransitionUpdateRq }) {
        return settings.client.POST("/private/transition/{transitionId}/v1", {
            params: {
                header: getApiDomainHeaders(settings),
                path: {transitionId}
            },
            body: data
        })
    }

    return {search, getById, create, update, getTransitionById, createTransition, updateTransition}
}

export type TwinflowApi = ReturnType<typeof createTwinflowApi>;