import {ApiSettings, getApiDomainHeaders} from "@/lib/api/api";
import {TwinClassStatusCreateRq, TwinClassStatusUpdateRq} from "@/lib/api/api-types";


export function createTwinStatusApi(settings: ApiSettings) {
    function create({twinClassId, data}: { twinClassId: string, data: TwinClassStatusCreateRq }) {
        return settings.client.POST('/private/twin_class/{twinClassId}/twin_status/v1', {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinClassId: twinClassId}
            },
            body: data
        })
    }

    function update({statusId, data}: { statusId: string, data: TwinClassStatusUpdateRq }) {
        return settings.client.PUT('/private/twin_status/{twinStatusId}/v1', {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinStatusId: statusId}
            },
            body: data
        })
    }

    return {create, update}
}

export type TwinStatusApi = ReturnType<typeof createTwinStatusApi>;