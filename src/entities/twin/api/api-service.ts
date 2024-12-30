import { ApiSettings, getApiDomainHeaders } from "@/shared/api";
import { operations } from "@/shared/api/generated/schema";
import { PaginationState } from "@tanstack/table-core";
import { TwinFilters, TwinUpdateRq } from "./types";

export function createTwinApi(settings: ApiSettings) {
  function search({
    pagination,
    search,
    filters,
  }: {
    pagination: PaginationState;
    search?: string;
    filters?: TwinFilters;
  }) {
    return settings.client.POST("/private/twin/search/v3", {
      params: {
        header: getApiDomainHeaders(settings),
        query: {
          lazyRelation: false,
          showTwinMode: "DETAILED",
          showTwinClassMode: "DETAILED",
          showTwin2TwinClassMode: "DETAILED",
          showTwin2UserMode: "DETAILED",
          showTwin2StatusMode: "DETAILED",
          showTwinMarker2DataListOptionMode: "DETAILED",
          showTwinTag2DataListOptionMode: "DETAILED",
          showTwinByHeadMode: "YELLOW",
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
    query?: operations["twinViewV2"]["parameters"]["query"];
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

  function getFieldById({ fieldId }: { fieldId: string }) {
    return settings.client.GET("/private/twin/{twinId}/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId: fieldId },
        query: {
          showTwinFieldCollectionMode: "ALL_FIELDS",
        },
      },
    });
  }

  function getHistory({
    twinId,
    pagination,
  }: {
    twinId: string;
    pagination: PaginationState;
  }) {
    return settings.client.GET("/private/twin/{twinId}/history/list/v1", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId },
        query: {
          showHistory2TwinMode: "DETAILED",
          // showTwin2TwinClassMode: "DETAILED",
          showTwin2UserMode: "DETAILED",
          limit: pagination.pageSize,
          offset: pagination.pageIndex * pagination.pageSize,
        },
      },
    });
  }

  return {
    search,
    getById,
    update,
    getFieldById,
    getHistory,
  };
}

export type TwinApi = ReturnType<typeof createTwinApi>;
