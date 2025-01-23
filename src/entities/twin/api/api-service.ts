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
          showTwinAliasMode: "ALL",
          offset: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
          sortAsc: false,
        },
      },
      body: [
        {
          twinNameLikeList: search ? ["%" + search + "%"] : undefined,
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

  function getFieldsById({ twinId }: { twinId: string }) {
    return settings.client.GET("/private/twin/{twinId}/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId: twinId },
        query: {
          lazyRelation: false,
          showTwin2TwinClassMode: "DETAILED",
          showTwinClass2TwinClassFieldMode: "DETAILED",
          showTwinFieldCollectionMode: "ALL_FIELDS",
          showTwinClassFieldDescriptor2DataListOptionMode: "DETAILED",
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

  function getLinks({ twinId }: { twinId: string }) {
    return settings.client.GET("/private/twin/{twinId}/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId: twinId },
        query: {
          showTwin2TwinLinkMode: "DETAILED",
          showTwinLink2UserMode: "DETAILED",
          showTwinLink2LinkMode: "DETAILED",
          showTwinField2TwinMode: "DETAILED",
          showTwinByLinkMode: "GREEN",
        },
      },
    });
  }

  function upsertField({
    twinId,
    fieldKey,
    fieldValue,
  }: {
    twinId: string;
    fieldKey: string;
    fieldValue: string;
  }) {
    return settings.client.POST("/private/twin/{twinId}/field/{fieldKey}/v2", {
      params: {
        header: getApiDomainHeaders(settings),
        path: { twinId, fieldKey },
        query: {
          fieldValue,
        },
      },
    });
  }

  return {
    search,
    getById,
    update,
    getFieldsById,
    getHistory,
    getLinks,
    upsertField,
  };
}

export type TwinApi = ReturnType<typeof createTwinApi>;
