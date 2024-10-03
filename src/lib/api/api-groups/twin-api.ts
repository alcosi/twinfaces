import {ApiSettings, getApiDomainHeaders} from "@/lib/api/api";

export function createTwinApi(settings: ApiSettings) {

    function search() {
        return settings.client.POST('/private/twin/search/v3', {
            params: {
                header: getApiDomainHeaders(settings),
                query: {
                    showTwinClassMode: "DETAILED",
                    limit: 6,
                    offset: 0
                },
            },
            body: [{
                // twinClassIdList: search ? ['%' + search + '%'] : undefined,
            }]
        });
    }



    return {search}
}

export type TwinApi = ReturnType<typeof createTwinApi>;


















// lazyRelation: true,
//                 // showAttachment2TransitionMode:"MANAGED",
//                 // showAttachment2UserMode: "DETAILED",
//                 // showLinkDst2TwinClassMode: "MANAGED",
//                 // showTwin2AttachmentCollectionMode: "DIRECT",
//                 // showTwin2AttachmentMode: "DETAILED",
//                 // showTwin2StatusMode: "DETAILED",
//                 // showTwin2TransitionMode: "MANAGED",
//                 // showTwin2TwinClassMode: "MANAGED",
//                 // showTwin2TwinLinkMode: "DETAILED",
//                 // showTwin2UserMode: "DETAILED",
//                 // showTwinActionMode: "SHOW",
//                 // showTwinAliasMode: "DETAILED",
//                 // showTwinAttachmentCountMode: "DETAILED",
//                 // showTwinByHeadMode: "WHITE",
//                 // showTwinByLinkMode: "WHITE",
//                 // showTwinClass2LinkMode: "DETAILED",
//                 // showTwinClass2StatusMode: "DETAILED",
//                 // showTwinClass2TwinClassFieldMode: "MANAGED",
//                 // showTwinClassExtends2TwinClassMode: "MANAGED",
//                 // showTwinClassFieldDescriptor2DataListOptionMode: "DETAILED",
//                 // showTwinClassFieldDescriptor2TwinMode: "DETAILED",
//                 // showTwinClassFieldDescriptor2UserMode: "DETAILED",
//                 // showTwinClassHead2TwinClassMode: "MANAGED",
//                 // showTwinClassMarker2DataListOptionMode: "DETAILED",
//                 showTwinClassMode: "MANAGED",
//                 // showTwinClassTag2DataListOptionMode: "DETAILED",
//                 // showTwinFieldCollectionMode: "ALL_FIELDS",
//                 // showTwinLink2LinkMode: "DETAILED",
//                 // showTwinLink2UserMode: "DETAILED",
//                 // showTwinMarker2DataListOptionMode: "DETAILED",
//                 // showTwinMode: "DETAILED",
//                 // showTwinTag2DataListOptionMode: "DETAILED",
//                 offset: 0,
//                 limit: 10,
//                 // sortAsc: false,