import {ApiSettings, getApiDomainHeaders} from "@/lib/api/api";
import {TwinClassStatusCreateRequestBody, TwinClassStatusUpdateRequestBody} from "@/lib/api/api-types";


export function createTwinStatusApi(settings: ApiSettings) {
    function create({twinClassId, data}: { twinClassId: string, data: TwinClassStatusCreateRequestBody }) {
        return settings.client.POST('/private/twin_class/{twinClassId}/twin_status/v1', {
            params: {
                header: getApiDomainHeaders(settings),
                path: {twinClassId: twinClassId}
            },
            body: data
        })
    }

    function update({statusId, data}: { statusId: string, data: TwinClassStatusUpdateRequestBody }) {
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