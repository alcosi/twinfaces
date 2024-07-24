import {ApiSettings, getApiDomainHeaders} from "@/lib/api/api";
import {TwinClassStatusCreateRq, TwinClassStatusUpdateRq, TwinFlowTransitionCreateRq} from "@/lib/api/api-types";

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

    function search({twinClassId, offset}: {twinClassId: string, offset: number}) {
        return settings.client.POST("/private/twinflow/search/v1", {
            params: {
                header: getApiDomainHeaders(settings),
                query: {
                    showTwinflowMode: 'DETAILED',
                    showTwinflow2TransitionMode: 'DETAILED',
                    showTransition2StatusMode: 'SHORT',
                    showTwinflowInitStatus2StatusMode: 'SHORT',
                    offset: offset
                }
            },
            body: {
                twinClassIdList: [twinClassId]
            }
        })
    }

    function getById({twinFlowId}: {twinFlowId: string}) {
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

    function createTransition({twinFlowId, data}: { twinFlowId: string, data: TwinFlowTransitionCreateRq }) {
        return settings.client.POST("/private/twinflow/{twinflowId}/transition/v1", {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinflowId: twinFlowId}
            },
            body: data
        })
    }

    // function create({}: {data: }) {
    //
    // }

    // return {create, update}
    return {search,getById, createTransition}
}

export type TwinflowApi = ReturnType<typeof createTwinflowApi>;