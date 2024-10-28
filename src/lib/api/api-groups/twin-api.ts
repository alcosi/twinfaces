import { ApiSettings, getApiDomainHeaders } from "@/lib/api/api";
import { PaginationState } from "@tanstack/table-core";
import { components, operations } from "@/lib/api/generated/schema";
import { TwinUpdateRq } from "@/lib/api/api-types";

type TwinSearchApiFilters = Partial<
  Pick<
    components["schemas"]["TwinSearchRqV1"],
    | "twinIdList"
    | "twinNameLikeList"
    | "twinClassIdList"
    | "assignerUserIdList"
    | "headTwinIdList"
    | "tagDataListOptionIdList"
    | "markerDataListOptionIdList"
    | "statusIdList"
  >
>;

export function createTwinApi(settings: ApiSettings) {
  function search({
    search,
    pagination,
    filters,
  }: {
    search?: string;
    pagination: PaginationState;
    filters?: TwinSearchApiFilters;
  }) {
    return settings.client.POST("/private/twin/search/v3", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          showTwinMode: "DETAILED",
          showTwinClassMode: "DETAILED",
          showTwinMarker2DataListOptionMode: "DETAILED",
          showTwinTag2DataListOptionMode: "DETAILED",
          showTwin2TwinClassMode: "DETAILED",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: [
        {
          ...filters,
        },
      ],
    });
  }

  function getById({
    id,
    query = {},
  }: {
    id: string;
    query: operations["twinViewV2"]["parameters"]["query"];
  }) {
    return settings.client.GET("/private/twin/{twinId}/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId: id },
        query: query,
      },
    });
  }

  function update({ id, body }: { id: string; body: TwinUpdateRq }) {
    return settings.client.PUT("/private/twin/{twinId}/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId: id },
      },
      body: body,
    });
  }

  function searchLinks({ twinId }: { twinId: string }) {
    return settings.client.POST("/private/twin/search/v3", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          showTwin2TwinLinkMode: "DETAILED",
          offset: 0,
          limit: 10,
        },
      },
      body: [
        {
          headTwinIdList: [twinId],
        },
      ],
    });
  }

  return { search, getById, update, searchLinks };
}

export type TwinApi = ReturnType<typeof createTwinApi>;
